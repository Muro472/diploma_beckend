export class AppLog {
  public static logSequel(query: string, timing: number) {
    console.log(
      `CURRENT SQL QUERY:${query} COMPLETED IN TIMING: ${new Date().toString()}`,
    );
  }
}
