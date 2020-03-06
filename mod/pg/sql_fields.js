module.exports = async (fields, infoj) => {

  // Iterate through infoj and push individual entries into fields array
  await infoj.forEach(async entry => {

    if (entry.query) return

    if (entry.type === 'key') return

    if (entry.labelfx) fields.push(`\n   ${entry.labelfx} AS ${entry.field}_label`)
    
    if (entry.field) return fields.push(`\n   (${entry.fieldfx || entry.field}) AS ${entry.field}`)
    
  })

  return fields

}