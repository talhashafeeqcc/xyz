module.exports = {
admin_user: true,
render: _ => `
SELECT access_log
FROM acl_schema.acl_table
WHERE lower(email) = lower('${_.email}');`}