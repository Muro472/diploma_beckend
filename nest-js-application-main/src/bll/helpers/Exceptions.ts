export class Exceptions {
  public static isExistsConstraintError(ex: string, entity: string) {
    if (!ex) {
      return 'DEFAULT_EXCEPTION';
    }
    if (ex === 'SequelizeUniqueConstraintError: Validation error') {
      return `${entity} is exists!`;
    }
  }

}
