const USERNAME_PREFIXES = [
  'music',
  'vinyl',
  'sound',
  'indie',
  'metal',
  'pop',
  'noise',
  'dream',
  'riff',
  'bass',
  'ambient',
  'punk',
  'hiphop',
  'synth',
  'folk',
  'prog',
  'emo',
  'postrock',
  'grunge',
  'techno',
  'house',
  'trance',
  'soul',
  'funk',
  'hardcore',
  'experimental',
]

const USERNAME_SUFFIXES = [
  'lover',
  'head',
  'freak',
  'addict',
  'critic',
  'fan',
  'stan',
  'wanderer',
  'pilgrim',
  'master',
  'king',
  'drift',
  'vibes',
  'legacy',
  'connoisseur',
  'kid',
  'unit',
  'cloud',
  'journey',
]

const EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
]

function generateRandomUsers(
  count: number
): Array<{ email: string; username: string }> {
  const used = new Set<string>()
  const users: Array<{ email: string; username: string }> = []

  while (users.length < count) {
    const prefix =
      USERNAME_PREFIXES[Math.floor(Math.random() * USERNAME_PREFIXES.length)]
    const suffix =
      USERNAME_SUFFIXES[Math.floor(Math.random() * USERNAME_SUFFIXES.length)]
    const number = Math.random() < 0.5 ? Math.floor(Math.random() * 99) : ''
    const username = `${prefix}${suffix}${number}`

    if (used.has(username)) {
      continue
    }
    used.add(username)

    const domain =
      EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)]
    users.push({ email: `${username}@${domain}`, username })
  }

  return users
}

export const RANDOM_USERS = generateRandomUsers(50)
