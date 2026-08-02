import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { PublicId } from '../src/contexts/!common/public-id'
import { slugify } from '../src/contexts/!common/slugify'
import { Album } from '../src/contexts/catalog/domain/album'
import { Genre } from '../src/contexts/catalog/domain/genre'
import { AlbumId } from '../src/contexts/catalog/domain/value-objects/album-id'
import { Artist } from '../src/contexts/catalog/domain/value-objects/artist'
import { CoverUrl } from '../src/contexts/catalog/domain/value-objects/cover-url'
import { GenreId } from '../src/contexts/catalog/domain/value-objects/genre-id'
import { GenreName } from '../src/contexts/catalog/domain/value-objects/genre-name'
import { ReleaseDate } from '../src/contexts/catalog/domain/value-objects/release-date'
import { Title } from '../src/contexts/catalog/domain/value-objects/title'
import { AlbumModel } from '../src/contexts/catalog/infra/persistence/album-model'
import { MongooseAlbumRepository } from '../src/contexts/catalog/infra/persistence/album-repository'
import { MongooseGenreRepository } from '../src/contexts/catalog/infra/persistence/genre-repository'
import { Review } from '../src/contexts/rating/domain/review'
import { Rating } from '../src/contexts/rating/domain/value-objects/rating'
import { ReviewId } from '../src/contexts/rating/domain/value-objects/review-id'
import { ReviewedAt } from '../src/contexts/rating/domain/value-objects/reviewed-at'
import { MongooseReviewRepository } from '../src/contexts/rating/infra/persistence/review-repository'
import { Email } from '../src/contexts/user/domain/value-objects/email'
import { UserId } from '../src/contexts/user/domain/value-objects/user-id'
import { Username } from '../src/contexts/user/domain/value-objects/username'
import { UserModel } from '../src/contexts/user/infra/persistence/user-model'
import { env } from '../src/infra/config/envs'
import { RANDOM_ALBUMS, type RandomAlbum } from './random-albums'
import { RANDOM_USERS } from './random-users'

const DEFAULT_PASSWORD = 'Senha@123'
const BCRYPT_SALT_ROUNDS = 12
const MIN_REVIEWS_PER_ALBUM = 15
const MAX_REVIEWS_PER_ALBUM = 45

async function seedGenres(genreRepo: MongooseGenreRepository) {
  const allGenreNames = [...new Set(RANDOM_ALBUMS.flatMap((a) => a.genres))]

  const results = await Promise.all(
    allGenreNames.map(async (name) => {
      const id = GenreId.create(name)
      const existing = await genreRepo.findBySlug(id.value)
      return { existing, id, name }
    })
  )

  const saves = results
    .filter((r) => !r.existing && GenreName.create(r.name).ok)
    .map(async (r) => {
      const genreName = GenreName.create(r.name) as {
        ok: true
        value: GenreName
      }
      await genreRepo.save(Genre.create({ id: r.id, name: genreName.value }))
    })

  const created = (await Promise.all(saves)).length
  console.log(
    `✓ ${created} gêneros criados (${allGenreNames.length - created} já existiam)`
  )
}

async function seedUser() {
  const hashedPassword = await bcrypt.hash('Senha@123', 12)
  const existingUser = await UserModel.findOne({ username: 'abner' }).lean()
  if (existingUser) {
    console.log('✓ Usuário "abner" já existe')
  } else {
    await UserModel.create({
      createdAt: new Date(),
      email: 'abner@email.com',
      password: hashedPassword,
      publicId: PublicId.create().value,
      updatedAt: new Date(),
      username: 'abner',
    })
    console.log('✓ Usuário "abner" criado')
  }

  return UserId.create({
    email: Email.unsafe('abner@email.com'),
    username: Username.unsafe('abner'),
  })
}

type SeedResult = {
  albumAdded: boolean
  status: 'created' | 'skipped' | 'error'
}

async function ensureAlbum(
  sa: RandomAlbum,
  albumRepo: MongooseAlbumRepository,
  genreRepo: MongooseGenreRepository
): Promise<{ album: Album | null; added: boolean }> {
  const albumId = AlbumId.create({
    artist: Artist.unsafe(sa.artist),
    title: Title.unsafe(sa.title),
  })

  const existing = await albumRepo.findById(albumId)
  if (existing) {
    return { added: false, album: existing }
  }

  const releaseDateResult = ReleaseDate.create(new Date(sa.releaseDate))
  if (!releaseDateResult.ok) {
    return { added: false, album: null }
  }

  const genreObjects = await genreRepo.findByIds(sa.genres.map(GenreId.create))
  if (genreObjects.length === 0) {
    return { added: false, album: null }
  }

  try {
    const album = await albumRepo.save(
      Album.create({
        coverUrl: CoverUrl.create(),
        format: sa.format,
        genres: genreObjects,
        id: albumId,
        releaseDate: releaseDateResult.value,
      })
    )
    return { added: true, album }
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      const recovered = await albumRepo.findByPublicId(
        PublicId.unsafe(`${slugify(sa.artist)}-${slugify(sa.title)}`)
      )
      if (recovered) {
        return { added: false, album: recovered }
      }
    }
    return { added: false, album: null }
  }
}

async function processSeedAlbum(
  sa: RandomAlbum,
  albumRepo: MongooseAlbumRepository,
  reviewRepo: MongooseReviewRepository,
  genreRepo: MongooseGenreRepository,
  user: UserId
): Promise<SeedResult> {
  const { album, added: albumAdded } = await ensureAlbum(
    sa,
    albumRepo,
    genreRepo
  )
  if (!album) {
    return { albumAdded, status: 'error' }
  }

  const ratingResult = Rating.create(sa.rating)
  if (!ratingResult.ok) {
    return { albumAdded, status: 'error' }
  }

  try {
    await reviewRepo.save(
      Review.create({
        id: ReviewId.create({ albumId: album.id, userId: user }),
        isFavorite: false,
        rating: ratingResult.value,
        reviewedAt: ReviewedAt.unsafe(new Date()),
        reviewText: null,
      })
    )
    return { albumAdded, status: 'created' }
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      return { albumAdded, status: 'skipped' }
    }
    return { albumAdded, status: 'error' }
  }
}

async function seedAlbumsAndReviews(
  albumRepo: MongooseAlbumRepository,
  reviewRepo: MongooseReviewRepository,
  genreRepo: MongooseGenreRepository,
  user: UserId
) {
  const results = await Promise.allSettled(
    RANDOM_ALBUMS.map((sa) =>
      processSeedAlbum(sa, albumRepo, reviewRepo, genreRepo, user)
    )
  )

  let albumsCreated = 0
  let reviewsCreated = 0
  let skipped = 0
  let errors = 0

  for (const r of results) {
    if (r.status === 'rejected') {
      errors += 1
      continue
    }
    if (r.value.albumAdded) {
      albumsCreated += 1
    }
    if (r.value.status === 'created') {
      reviewsCreated += 1
    } else if (r.value.status === 'skipped') {
      skipped += 1
    } else {
      errors += 1
    }
  }

  console.log(`✓ ${albumsCreated} álbuns criados`)
  console.log(`✓ ${reviewsCreated} reviews criadas`)
  if (skipped > 0) {
    console.log(`ℹ ${skipped} já existiam`)
  }
  if (errors > 0) {
    console.warn(`⚠ ${errors} erros`)
  }
}

function randomRating(): number {
  const mean = 3.6
  const stdDev = 0.7

  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

  const value = Math.min(5, Math.max(1, mean + z * stdDev))
  return Math.round(value * 2) / 2
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

async function cleanDatabase() {
  const db = mongoose.connection.getClient().db()
  const collections = await db.listCollections().toArray()
  await Promise.all(
    collections.map((col) => db.collection(col.name).deleteMany({}))
  )
  console.log('✓ Banco de dados limpo')
}

async function seedRandomUsers() {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_SALT_ROUNDS)

  const results = await Promise.all(
    RANDOM_USERS.map(async (u) => {
      const existing = await UserModel.findOne({ username: u.username }).lean()
      if (existing) {
        return false
      }

      await UserModel.create({
        createdAt: new Date(),
        email: u.email,
        password: hashedPassword,
        publicId: PublicId.create().value,
        updatedAt: new Date(),
        username: u.username,
      })
      return true
    })
  )

  console.log(`✓ ${results.filter(Boolean).length} usuários aleatórios criados`)
}

async function seedRandomReviews(
  reviewRepo: MongooseReviewRepository,
  albumRepo: MongooseAlbumRepository
) {
  const allAlbums = await albumRepo.find()
  if (allAlbums.items.length === 0) {
    console.log('⚠ Nenhum álbum encontrado, pulando reviews aleatórias')
    return
  }

  const tasks = allAlbums.items.flatMap((album) => {
    const targetCount =
      MIN_REVIEWS_PER_ALBUM +
      Math.floor(
        Math.random() * (MAX_REVIEWS_PER_ALBUM - MIN_REVIEWS_PER_ALBUM + 1)
      )
    const picked = shuffle(RANDOM_USERS).slice(
      0,
      Math.min(targetCount, RANDOM_USERS.length)
    )

    return picked.map(async (u) => {
      const user = UserId.create({
        email: Email.unsafe(u.email),
        username: Username.unsafe(u.username),
      })

      const ratingResult = Rating.create(randomRating())
      if (!ratingResult.ok) {
        return false
      }

      try {
        await reviewRepo.save(
          Review.create({
            id: ReviewId.create({ albumId: album.id, userId: user }),
            isFavorite: false,
            rating: ratingResult.value,
            reviewedAt: ReviewedAt.unsafe(new Date()),
            reviewText: null,
          })
        )
        return true
      } catch {
        return false
      }
    })
  })

  const results = await Promise.allSettled(tasks)
  const reviewsCreated = results.filter(
    (r) => r.status === 'fulfilled' && r.value
  ).length

  console.log(
    `✓ ${reviewsCreated} reviews aleatórias criadas (${tasks.length} tentativas)`
  )
}

async function seed() {
  const startedAt = Date.now()

  try {
    await mongoose.connect(env.MONGODB_URI)
    await cleanDatabase()

    const genreRepo = new MongooseGenreRepository()
    const albumRepo = new MongooseAlbumRepository()
    const reviewRepo = new MongooseReviewRepository(UserModel, AlbumModel)

    await seedGenres(genreRepo)
    const user = await seedUser()
    await seedAlbumsAndReviews(albumRepo, reviewRepo, genreRepo, user)
    await seedRandomUsers()
    await seedRandomReviews(reviewRepo, albumRepo)

    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
    console.log(`✓ Seed concluído em ${elapsed}s!`)
  } finally {
    await mongoose.disconnect()
  }
}

seed().catch((err) => {
  console.error('Erro no seed:', err)
  process.exit(1)
})
