module.exports = {
admin_user: true,
render: _ => `
SELECT
  email,
  verified,
  approved,
  admin_user,
  admin_workspace,
  length(api)::boolean AS api,
  roles,
  access_log[array_upper(access_log, 1)],
  failedattempts,
  approved_by,
  blocked
FROM acl_schema.acl_table;`}