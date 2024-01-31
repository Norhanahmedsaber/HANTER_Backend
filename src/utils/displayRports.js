function sortReports(reports) {
if(!reports)
{
    return []
}
  // Create an object to hold reports without rule_name, using rule_name as key
  const reportsMap = {};

  // Iterate through the reports and group them by rule_name
  reports.forEach((report) => {
      const { rule_name, ...rest } = report;

      // If rule_name doesn't exist in reportsMap, add it
      if (!reportsMap[rule_name]) {
          reportsMap[rule_name] = [];

      }

      // Push the report without rule_name into the corresponding subarray
      reportsMap[rule_name].push(rest);
  });

  // Create an array of objects with one occurrence of each rule_name
  const resultArray = Object.keys(reportsMap).map((rule_name) => {
      return {
          rule_name,
          reports: reportsMap[rule_name],
      };
  });

  return resultArray;
}
module.exports={
    sortReports
}