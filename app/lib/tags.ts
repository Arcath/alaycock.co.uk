import {getPrisma} from './prisma.server'

export const getTags = async () => {
  const prisma = getPrisma()

  return prisma.$queryRaw<{tag: string}[]>`WITH split(tag, csv) AS (
    SELECT
      '',
      replace(tags,', ',',')||','
      FROM
        Post
    UNION ALL SELECT
      substr(csv, 0, instr(csv, ',')),
      substr(csv, instr(csv, ',') + 1)
    FROM split
    WHERE csv != ''
  ) SELECT DISTINCT tag FROM split 
  WHERE tag != ''
  ORDER BY tag ASC;
  `
}
