const { query } = require("express");
const pool = require("../database/postgres");

async function createRule(name, created_by, url, uuid, public, severity) {
  const client = await pool.connect();
  const { rows, rowCount } = await client.query(
    "INSERT INTO rules (uuid,name,url,created_by,public,severity) " +
    "VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
    [uuid, name, url, created_by, public, severity]
  );
  client.release();
  if (rowCount) {
    return rows[0];
  }
  return null;
}
async function getbyUserId(id) {
  const client = await pool.connect();
  const { rows, rowCount } = await client.query(
    "SELECT * FROM rules where created_by =$1",
    [id]
  );
  client.release();
  if (rowCount) {
    return rows;
  }
}
async function deleteRule(uuid) {
  const client = await pool.connect();
  const { rows, rowCount } = await client.query(
    "SELECT id FROM rules WHERE uuid=$1",
    [uuid]
  );
  const id = rows[0].id;
  if (!rowCount) {
    return null;
  }
  await client.query("DELETE FROM projects_rules WHERE rule_id=$1", [id]);
  const { rows: rules, rowCount: ruleCount } = await client.query(
    "DELETE FROM rules WHERE uuid=$1 ",
    [uuid]
  );
  if (!ruleCount) {
    return null;
  }
  client.release();
  return ruleCount;
}
async function isExisted(uuid) {
  const client = await pool.connect();
  const { rowCount } = await client.query(
    "SELECT id FROM rules where uuid = $1",
    [uuid]
  );
  client.release();
  if (rowCount) {
    return true;
  }
  return false;
}

async function getById(id) {
  const client = await pool.connect();
  const { rows, rowCount } = await client.query(
    "SELECT * FROM rules where id = $1",
    [id]
  );
  client.release();
  if (rowCount) {
    return rows[0];
  }
  return null;
}
async function getSystemRules() {
  const client = await pool.connect();
  const { rows } = await client.query(
    "SELECT name , id FROM rules WHERE created_by IS NULL"
  );
  client.release();
  return rows;
}
async function isExistById(id) {
  const client = await pool.connect();
  const { rows, rowCount } = await client.query(
    "SELECT id FROM rules where id=$1",
    [id]
  );
  client.release();
  if (rowCount) {
    return rows[0];
  }
  return null;
}

async function isValidName(name, createdBy) {
  const client = await pool.connect();
  const { rows, rowCount } = await client.query(
    "SELECT name FROM rules where name=$1 AND public=$2",
    [name, 1]
  );
  if (rowCount) {
    return false;
  }
  const { rows: rows2, rowCount: rowCount2 } = await client.query(
    "SELECT created_by From rules where name=$1 AND created_by=$2",
    [name, createdBy]
  );
  if (rowCount2) {
    return false;
  }

  client.release();
  return true;
}
async function getByIds(ids) {
  const client = await pool.connect();
  const rules = []
  for (let id of ids) {
    const { rows, rowCount } = await client.query(
      "SELECT * FROM rules where id = $1",
      [id]
    );
    if (rowCount) {
      rules.push(rows[0])
    }
  }
  client.release()
  return rules
}

async function getProjectRules(id) {
  const client = await pool.connect()
  const { rows, rowCount } = await client.query("SELECT rule_id FROM projects_rules WHERE project_id=$1", [id])
  client.release()
  if (rowCount) {
    return rows
  }
  return null

}
module.exports = {
  createRule,
  getbyUserId,
  deleteRule,
  getById,
  getByIds,
  isExisted,
  getSystemRules,
  isExistById,
  isValidName,
  getProjectRules
};
