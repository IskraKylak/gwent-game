import type { UnitAbility } from "@/stores/abilities"

export type Race = 'beasts' | 'mages' | 'undead' | 'mechanical'
export type CardType = 'unit' | 'special'

export interface BaseCard {
  id: string
  name: string
  race: Race
  type: CardType
}

export interface UnitCard extends BaseCard {
  type: 'unit'
  power: number
  tags?: string[]
  ability?: UnitAbility
  isBuffed?: boolean         // позначка, що карта отримала ефект
  basePower: number
}

export type SpecialEffect =
  | 'boostAllies'       // +power до всіх своїх юнітів
  | 'weakenEnemies'     // -power до всіх ворожих юнітів
  | 'scorchStrongest'   // спалити(видалити) всі найсильніші карти на полі
  | 'draw1'             // добрати 1 карту з колоди

export interface SpecialCard extends BaseCard {
  type: 'special'
  effect: SpecialEffect
  value?: number        // величина буста/дебафа (де потрібно)
}

export type Card = UnitCard

// --------- helpers ----------
const uid = (prefix: string, i: number) =>
  `${prefix}-${i}-${Math.random().toString(36).slice(2, 6)}`

function repeatSpecials(
  race: Race,
  base: { name: string; effect: SpecialEffect; value?: number }[]
): SpecialCard[] {
  // робимо по 3 копії кожної базової спецкарти (разом 12)
  const out: SpecialCard[] = []
  let idx = 1
  for (const s of base) {
    for (let k = 0; k < 3; k++) {
      const variance = typeof s.value === 'number' ? (k - 1) : undefined // -1,0,+1
      out.push({
        id: uid(`${race}-sp`, idx++),
        type: 'special',
        race,
        name: s.name + (k ? ` ${k + 1}` : ''),
        effect: s.effect,
        value:
          typeof s.value === 'number'
            ? Math.max(1, s.value + (variance ?? 0))
            : undefined,
      })
    }
  }
  return out
}

function makeRaceCards(
  race: Race,
  units: { name: string; power: number }[]
): Card[] {
  // 8 юнітів
  const unitCards: UnitCard[] = units.slice(0, 8).map((u, i) => ({
    id: uid(`${race}-u`, i + 1),
    type: 'unit',
    race,
    name: u.name,
    basePower: u.power,
    isBuffed: false,
    power: u.power,
    ability: (u as any).ability as UnitAbility | undefined,
  }))
  // 12 спеціальних (4 базові × 3 копії)
  // const specialCards = repeatSpecials(race, specials.slice(0, 4))
  return [...unitCards] // разом 20
}

// --------- списки по расах ----------
const beastsUnits = [
  { name: 'Вовк', power: 3 },
  { name: 'Лев', power: 6 },
  { name: 'Ведмідь', power: 7 },
  { name: 'Тигр', power: 5 },
  { name: 'Ягуар', power: 4 },
  { name: 'Бізон', power: 6 },
  { name: 'Орел', power: 2 },
  { name: 'Мамонт', power: 8 },
]

const magesUnits = [
  { name: 'Маг-Учень', power: 3 },
  { name: 'Арканіст', power: 5 },
  { name: 'Чарівник Вітру', power: 4 },
  { name: 'Льодяний Маг', power: 4 },
  { name: 'Вогняний Елементаль', power: 6 },
  { name: 'Жрець Світла', power: 3, ability: { type: 'buffAllyRandom', multiplier: 2 } },
  { name: 'Маг Тіні', power: 2 },
  { name: 'Архімаг', power: 8 }
]

const undeadUnits = [
  { name: 'Скелет-Воїн', power: 3 },
  { name: 'Зомбі', power: 4 },
  { name: 'Привид', power: 2 },
  { name: 'Некромант', power: 5, ability: { type: 'summonFromDeck' } },
  { name: 'Вампір', power: 6 },
  { name: 'Кістяний Голем', power: 7 },
  { name: 'Проклятий Рицар', power: 6 },
  { name: 'Ліхтарник', power: 1 },
]

const mechUnits = [
  { name: 'Механічний Солдат', power: 3 },
  { name: 'Снайпер-Бот', power: 4 },
  { name: 'Автоматон', power: 2 },
  { name: 'Танк', power: 8 },
  { name: 'Дрон', power: 1 },
  { name: 'Штурм-Бот', power: 6, ability: { type: 'destroyEnemyRandom' } },
  { name: 'Сервіс-Робот', power: 2 },
  { name: 'Сталева Бруталка', power: 7 },
]

// --------- експорт усіх 80 карт ----------
export const cards: Card[] = [
  ...makeRaceCards('beasts', beastsUnits),
  ...makeRaceCards('mages', magesUnits),
  ...makeRaceCards('undead', undeadUnits),
  ...makeRaceCards('mechanical', mechUnits),
]
