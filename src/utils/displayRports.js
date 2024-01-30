function sortReports(reports) {
    // Create an object to hold subarrays based on rule_name
    const ruleNameMap = {};
  
    // Iterate through the reports and group them by rule_name
    reports?.forEach((report) => {
      const { rule_name } = report;
      if (!ruleNameMap[rule_name]) {
        ruleNameMap[rule_name] = [];
      }
      ruleNameMap[rule_name].push(report);
    });
  
    // Sort each subarray by line in ascending order
    for (const rule_name in ruleNameMap) {
      ruleNameMap[rule_name].sort((a, b) => a.line - b.line);
    }
  
    // Return an array of subarrays
    return Object.values(ruleNameMap);

 }
module.exports={
    sortReports
}