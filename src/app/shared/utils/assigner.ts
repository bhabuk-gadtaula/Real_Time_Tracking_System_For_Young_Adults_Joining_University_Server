import { Assigner, ProjectTableName } from '../enums';

export function assigner(tableName: ProjectTableName | string, assigner: Assigner) {
  const obj = `
        json_build_object(
          'at', ${tableName}.${assigner}_at,
          'id', ${tableName}.${assigner}_by,
          'by', (
            select
                CONCAT(
                    ${assigner}User.first_name,
                    CASE
                      WHEN ${assigner}User.middle_name IS NOT NULL THEN ' ' || ${assigner}User.middle_name
                      ELSE ''
                    END,
                    ' ',
                    ${assigner}User.last_name
              ) as fullName
            from ${ProjectTableName.USER} as ${assigner}User
            where ${tableName}.${assigner}_by = ${assigner}User.id
            )
      )   as "${assigner}"
    `;

  return obj;
}
