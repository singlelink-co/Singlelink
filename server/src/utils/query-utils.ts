export class QueryUtils {


  /**
   * Utility function that creates parameterized values to use within a query.
   *
   * Put this in a template string for best results. If you have more than 10,000 records, it is recommended you
   * batch your queries.
   *
   * Ex: `insert into app.links values ${QueryUtils.values(3, 3)} where profile_id=$1`
   *
   * After you use the function to batch, use Array.flat to pass in your values.
   *
   * Ex: [[4, 5, 3], [2, 4, 5], [6, 5, 3]].flat();
   *
   * @param paramCount The number of params to insert per row
   * @param rowCount The number of rows being inserted
   */
  static values(paramCount: number, rowCount?: number): string {
    if (!rowCount) rowCount = 1;

    let counter: number = 1;
    let valueString: string = "";

    for (let i = 0; i < rowCount; i++) {

      valueString += "(";

      for (let j = 1; j <= paramCount; j++) {
        valueString += "$" + (counter);

        if (j < paramCount) {
          valueString += ",";
        }

        counter++;
      }

      valueString += ")";

      if (i < rowCount - 1) {
        valueString += ",";
      }

    }

    return valueString;
  }


}
