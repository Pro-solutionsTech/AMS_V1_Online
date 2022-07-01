import axios from "axios";
import Swal from "sweetalert2";
import { convertToObject } from "typescript";

let today = new Date().toISOString().split("T")[0];

export function formatToCurrency(amount) {
  if (amount == null) {
    amount = 0;
  }
  return "₱ " + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
} //Currency Piso

export function onlineGetError(error) {
  Swal.fire("Error", error.message, "error");
  Swal.fire(
    "Error",
    "It looks like there is a misconfiguration with your local database! Please contact your system administrator.",
    "error"
  );
  throw error;
}

export async function onlineGet(apiUrl, apiToken, credentialsDispatch) {
  let latestSync = await lastestSyncDate();

  if (!latestSync) {
    return axios
      .get(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((response) => response.data);
  }
  return axios
    .get(`${apiUrl}?updated_at__gte=${latestSync.sync_date}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    })
    .then((response) => response.data);
}

function getDatabase() {
  const { remote } = window.require("electron");
  return remote.getGlobal("database");
}

export function offlineDatabaseError(error) {
  Swal.fire("Error", error.message, "error");
  Swal.fire(
    "Error",
    "It looks like there is a misconfiguration with your local database! Please contact your system administrator.",
    "error"
  );
  throw error;
}

export function offlineMessage(message) {
  Swal.fire("Error", message, "error");
}

export function offlineSelectHave(tableName, id, my_id) {
  return getDatabase()
    .connection(tableName)
    .select("*")
    .select("users.initial as initial")
    .orderBy("remarks.created_at", "desc")
    .join("users", "remarks.staff_id", "users.staff_id")
    .where(`${my_id}`, id)
    .catch(offlineDatabaseError)
    .then((data) => data);
}

export function offlineSelectOne(tableName, id, where) {
  if (where) {
    return getDatabase()
      .connection(tableName)
      .select("*")
      .where(where, id)
      .catch(offlineDatabaseError)
      .then((data) => data[0]);
  } else {
    return getDatabase()
      .connection(tableName)
      .select("*")
      .where("id", id)
      .catch(offlineDatabaseError)
      .then((data) => data[0]);
  }
}

export function offlineSelectOneIncome(tableName, id, where) {
  if (where) {
    return getDatabase()
      .connection(tableName)
      .select(
        "income_entry.id",
        "income_entry.amount",
        "income_entry.date",
        "income_entry.description",
        "income_entry.receive_from",
        "income_entry.title",
        "finance_accounts.name as finance_account",
        "finance_categories.name as finance_category"
      )
      .where(where, id)
      .leftJoin(
        "finance_categories",
        "income_entry.finance_category",
        "finance_categories.id"
      )
      .leftJoin(
        "finance_accounts",
        "income_entry.add_to",
        "finance_accounts.id"
      )
      .catch(offlineDatabaseError)
      .then((data) => data[0]);
  } else {
    return getDatabase()
      .connection(tableName)
      .select("*")
      .where("id", id)
      .catch(offlineDatabaseError)
      .then((data) => data[0]);
  }
}

export function offlineSelectTransaction(tableName, id) {
  return getDatabase()
    .connection(tableName)
    .select("*")
    .where("transaction_id", id)
    .catch(offlineDatabaseError)
    .then((data) => data[0]);
}

export function offlineSelectAll(
  tableName,
  pageNumber,
  pageLimit,
  totalStudents,
  searchQuery,
  searchFields = ["id"],
  isWhere,
  isWhereValue
) {
  const offsetValue = (pageNumber - 1) * pageLimit;

  if (searchQuery) {
    const words = searchQuery.split(" ");

    let queryBuilder;

    if (totalStudents > pageLimit) {
      queryBuilder = getDatabase()
        .connection(tableName)
        .select("*")
        .limit(pageLimit)
        .offset(offsetValue);
    } else {
      queryBuilder = getDatabase().connection(tableName).select("*");
    }

    searchFields.forEach((field) => {
      words.forEach((word) => {
        queryBuilder.orWhere(field, "like", `%${word}%`);
      });
    });

    return queryBuilder.catch(offlineDatabaseError);
  }

  if (isWhere) {
    return getDatabase()
      .connection(tableName)
      .select("*")
      .where(`${isWhere}`, isWhereValue)
      .limit(pageLimit)
      .offset(offsetValue)
      .catch(offlineDatabaseError);
  } else {
    return getDatabase()
      .connection(tableName)
      .select("*")
      .limit(pageLimit)
      .offset(offsetValue)
      .catch(offlineDatabaseError);
  }
}

export function offlineUpdateOrInsertTransactionById(tableName, data) {
  const connection = getDatabase().connection(tableName);

  return connection
    .select("id")
    .where("transaction_id", data.transaction_id)
    .catch(offlineDatabaseError)
    .then((transac) => {
      if (transac.length) {
        return connection
          .select("*")
          .where("transaction_id", data.transaction_id)
          .update(data)
          .catch(offlineDatabaseError);
      } else {
        return connection.insert(data).catch(offlineDatabaseError);
      }
    });
}

export function countOffline(tableName, searchQuery, searchFields = ["id"]) {
  if (searchQuery) {
    const words = searchQuery.split(" ");

    const queryBuilder = getDatabase()
      .connection(tableName)
      .count("* as total");

    searchFields.forEach((field) => {
      words.forEach((word) => {
        queryBuilder.orWhere(field, "like", `%${word}%`);
      });
    });

    return queryBuilder
      .catch(offlineDatabaseError)
      .then((result) => result[0].total);
  }

  return getDatabase()
    .connection(tableName)
    .count("* as total")
    .catch(offlineDatabaseError)
    .then((result) => result[0].total);
}

export function offlineUpdateOrInsert(tableName, data) {
  const connection = getDatabase().connection(tableName);

  return connection
    .select("id")
    .where("id", data.id)
    .catch(offlineDatabaseError)
    .then((enrollment) => {
      if (enrollment.length) {
        return connection
          .select("*")
          .where("id", data.id)
          .update(data)
          .catch(offlineDatabaseError);
      } else {
        return connection.insert(data).catch(offlineDatabaseError);
      }
    });
}

export function offlineInsertOnly(tableName, data) {
  const connection = getDatabase().connection(tableName);
  return connection.insert(data).catch(offlineDatabaseError);
}

export function createUUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export function offlineDistinct(tableName, column) {
  return getDatabase()
    .connection(tableName)
    .distinct(column)
    .orderBy(column)
    .catch(offlineDatabaseError)
    .then((data) => data);
}

export function offlineFilterByGradeAndSection(
  tableName,
  pageNumber,
  pageLimit,
  grade,
  section,
  school_year
) {
  const offsetValue = (pageNumber - 1) * pageLimit;

  let queryBuilder = getDatabase()
    .connection(tableName)
    .select("*")
    .limit(pageLimit)
    .offset(offsetValue);

  if (grade) {
    queryBuilder.orWhere("grade", grade);
  }

  if (section) {
    queryBuilder.orWhere("section", section);
  }
  if (school_year) {
    queryBuilder.orWhere("school_year", school_year);
  }

  return queryBuilder.catch(offlineDatabaseError);
}

export function countOfflineFilter(tableName, grade, section, school_year) {
  let queryBuilder = getDatabase().connection(tableName).count("* as total");

  if (grade) {
    queryBuilder.orWhere("grade", grade);
  }

  if (section) {
    queryBuilder.orWhere("section", section);
  }

  if (school_year) {
    queryBuilder.orWhere("school_year", school_year);
  }

  return queryBuilder
    .catch(offlineDatabaseError)
    .then((result) => result[0].total);
}

export async function allTransactions(formData) {
  let queryBuilder = getDatabase().connection("transactions");

  async function getFirstTransaction() {
    const value = await getDatabase()
      .connection("transactions")
      .select("created_at");
    return value[0].created_at;
  }
  const getFirstTransac = await getFirstTransaction();

  async function getLastTransaction() {
    const value = await getDatabase()
      .connection("transactions")
      .select("created_at");
    return value[value.length - 1].created_at;
  }

  const getLastTransac = await getLastTransaction();

  if (formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "transactions.is_reversal as income_is_reversal",
        "paid_particulars.is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .where("transactions.created_at", ">=", `${formData.dateFrom}T00:00:00Z`)
      .where("transactions.created_at", "<=", `${formData.dateTo}T23:59:59Z`)
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .orderBy("transactions.ecr_no", "asc");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "paid_particulars.is_reversal",
        "transactions.is_reversal as income_is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransac.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransac.split("T")[0]
        }T23:59:59Z`
      )
      .where("ecr_no", "like", `%${formData.initial}%`)
      .orderBy("transactions.ecr_no", "asc");
  } else if (!formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "paid_particulars.is_reversal",
        "transactions.is_reversal as income_is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransac.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransac.split("T")[0]
        }T23:59:59Z`
      )
      .where("ecr_no", "like", `%${formData.initial}%`)
      .orderBy("transactions.created_at", "desc");
  } else if (!formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "paid_particulars.is_reversal",
        "transactions.is_reversal as income_is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`);
  }

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function allTransactionCollections(formData) {
  let queryBuilder = getDatabase().connection("transactions");

  async function getFirstTransaction() {
    const value = await getDatabase()
      .connection("transactions")
      .select("created_at");
    return value[0].created_at;
  }
  const getFirstTransac = await getFirstTransaction();

  async function getLastTransaction() {
    const value = await getDatabase()
      .connection("transactions")
      .select("created_at");
    return value[value.length - 1].created_at;
  }

  const getLastTransac = await getLastTransaction();

  if (formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "income_entry.amount as income_amount",
        "income_entry.description",
        "finance_categories.name as category_name", //new
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "transactions.is_reversal as income_is_reversal",
        "paid_particulars.is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .leftJoin("finance_categories", "finance_categories.id", "income_entry.finance_category") //new
      .where("transactions.created_at", ">=", `${formData.dateFrom}T00:00:00Z`)
      .where("transactions.created_at", "<=", `${formData.dateTo}T23:59:59Z`)
      .where("ecr_no", "like", `%${formData.initial}%`)
      .orderBy("transactions.ecr_no", "asc");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "finance_categories.name as category_name", //new
        "income_entry.amount as income_amount",
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "paid_particulars.is_reversal",
        "transactions.is_reversal as income_is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .leftJoin("finance_categories", "finance_categories.id", "income_entry.finance_category")//new
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransac.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransac.split("T")[0]
        }T23:59:59Z`
      )
      .where("ecr_no", "like", `%${formData.initial}%`)
      .orderBy("transactions.ecr_no", "asc");
  } else if (!formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "income_entry.amount as income_amount",
        "finance_categories.name as category_name", //new
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "paid_particulars.is_reversal",
        "transactions.is_reversal as income_is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
      .leftJoin("finance_categories", "finance_categories.id", "income_entry.finance_category")//new
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransac.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransac.split("T")[0]
        }T23:59:59Z`
      )
      .where("ecr_no", "like", `%${formData.initial}%`)
      .orderBy("transactions.created_at", "desc");
  } else if (!formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select(
        "transactions.id",
        "transactions.ecr_no",
        "transactions.or_no",
        "transactions.amount as transaction_amount",
        "income_entry.amount as income_amount",
        "finance_categories.name as category_name", //new
        "particulars.name",
        "transactions.created_at",
        "paid_particulars.amount",
        "paid_particulars.is_reversal",
        "transactions.is_reversal as income_is_reversal",
        "income_entry.title as title",
        "income_entry.receive_from as receive_from"
      )
      .leftJoin(
        "paid_particulars",
        "transactions.id",
        "paid_particulars.transaction_id"
      )
      .leftJoin(
        "particulars",
        "paid_particulars.particular_id",
        "particulars.id"
      )
      .leftJoin("finance_categories", "finance_categories.id", "income_entry.finance_category")//new
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .leftJoin("income_entry", "income_entry.transaction", "transactions.id");

  }

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function listPerParticular(formData, filter) {
  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .select(
      "paid_particulars.id",
      "school_year",
      "first_name",
      "middle_name",
      "last_name",
      "grade",
      "section",
      "name",
      "paid_particulars.amount",
      "transactions.ecr_no as ecr_no",
      "transactions.created_at as transaction_date",
      "transactions.created_at",
      "particulars.id as particular_id"
    )
    .join("enrollments", "paid_particulars.student_id", "enrollments.id")
    .join("particulars", "paid_particulars.particular_id", "particulars.id")
    .join("transactions", "paid_particulars.transaction_id", "transactions.id")
    .where("ecr_no", "like", `%${formData.initial}%`)
    .orderBy("last_name", "asc")
    .where("paid_particulars.is_reversal", 0);

  async function getFirstTransacPerPaticular() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[0]?.created_at;
  }

  async function getLastTransacPerPaticular() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[value.length - 1]?.created_at;
  }

  let getFirstTransPer = await getFirstTransacPerPaticular();
  let getLastTransacPer = await getLastTransacPerPaticular();

  getFirstTransPer = getFirstTransPer
    ? getFirstTransPer
    : new Date().toISOString();
  getLastTransacPer = getLastTransacPer
    ? getLastTransacPer
    : new Date().toISOString();

  queryBuilder
    .where(
      "transactions.created_at",
      ">=",
      `${formData.dateFrom ? formData.dateFrom : getFirstTransPer.split("T")[0]
      }T00:00:00Z`
    )
    .where(
      "transactions.created_at",
      "<=",
      `${formData.dateTo ? formData.dateTo : getLastTransacPer.split("T")[0]
      }T23:59:59Z`
    );

  if (filter?.grade) {
    queryBuilder.where("grade", filter?.grade);
  }

  if (filter?.section) {
    queryBuilder.where("section", filter?.section);
  }

  if (filter?.particular) {
    queryBuilder.where("particular_id", filter?.particular);
  }

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function listNonStudent(formData) {
  let queryBuilder = getDatabase()
    .connection("income_entry")
    .select("income_entry.id", "finance_categories.name as finance_category")
    .sum("income_entry.amount as total")
    .groupBy("income_entry.finance_category")
    .join(
      "finance_categories",
      "income_entry.finance_category",
      "finance_categories.id"
    )
    .where("income_entry.is_reversal", 0)
    .join("transactions", "income_entry.transaction", "transactions.id");

  async function getFirstTransacPerPaticular() {
    const value = await getDatabase()
      .connection("income_entry")
      .select("*")
      .orderBy("income_entry.created_at")
      .where("income_entry.is_reversal", 0)
      .join("transactions", "income_entry.transaction", "transactions.id");
    return value[0]?.created_at;
  }

  async function getLastTransacPerPaticular() {
    const value = await getDatabase()
      .connection("income_entry")
      .select("*")
      .orderBy("income_entry.created_at")
      .where("income_entry.is_reversal", 0)
      .join("transactions", "income_entry.transaction", "transactions.id");
    return value[value.length - 1]?.created_at;
  }

  let getFirstTransPer = await getFirstTransacPerPaticular();
  let getLastTransacPer = await getLastTransacPerPaticular();

  getFirstTransPer = getFirstTransPer
    ? getFirstTransPer
    : new Date().toISOString();
  getLastTransacPer = getLastTransacPer
    ? getLastTransacPer
    : new Date().toISOString();

  queryBuilder
    .where(
      "transactions.created_at",
      ">=",
      `${formData.dateFrom ? formData.dateFrom : getFirstTransPer.split("T")[0]
      }T00:00:00Z`
    )
    .where(
      "transactions.created_at",
      "<=",
      `${formData.dateTo ? formData.dateTo : getLastTransacPer.split("T")[0]
      }T23:59:59Z`
    )
    .where("transactions.ecr_no", "like", `%${formData.initial}%`)
    .where("transactions.is_reversal", 0);

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function allPerParticular(formData) {
  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .where("paid_particulars.is_reversal", 0);

  async function getFirstTransacPerPaticular() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[0]?.created_at;
  }

  async function getLastTransacPerPaticular() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[value.length - 1]?.created_at;
  }

  let getFirstTransPer = await getFirstTransacPerPaticular();
  let getLastTransacPer = await getLastTransacPerPaticular();

  getFirstTransPer = getFirstTransPer
    ? getFirstTransPer
    : new Date().toISOString();
  getLastTransacPer = getLastTransacPer
    ? getLastTransacPer
    : new Date().toISOString();

  if (formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("*")
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransPer.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacPer.split("T")[0]
        }T23:59:59Z`
      )
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .orderBy("particulars.name", "asc");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("*")
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransPer.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacPer.split("T")[0]
        }T23:59:59Z`
      )

      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .orderBy("particulars.name", "asc");
  } else if (!formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("*")
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom ? formData.dateFrom : getFirstTransPer.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacPer.split("T")[0]
        }T23:59:59Z`
      )
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .orderBy("particulars.name", "asc");
  } else if (!formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("*")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .orderBy("particulars.name", "asc");
  }
  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function allPerGradeLevelElementary(formData) {
  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .where("paid_particulars.is_reversal", 0);

  async function getFirstPerGradeLevelElementary() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[0]?.created_at;
  }

  async function getLastPerGradeLevelElementary() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[value.length - 1]?.created_at;
  }

  let getFirstTransElem = await getFirstPerGradeLevelElementary();
  let getLastTransacElem = await getLastPerGradeLevelElementary();

  getFirstTransElem = getFirstTransElem
    ? getFirstTransElem
    : new Date().toISOString();
  getLastTransacElem = getLastTransacElem
    ? getLastTransacElem
    : new Date().toISOString();

  if (formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [1, 6])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransElem.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacElem.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [1, 6])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransElem.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacElem.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  } else if (!formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [1, 6])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransElem.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacElem.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  } else if (!formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [1, 6])
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  }

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function allPerGradeLevelJunior(formData) {
  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .where("paid_particulars.is_reversal", 0);

  async function getFirstPerGradeLevelJunior() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[0]?.created_at;
  }

  async function getLastPerGradeLevelJunior() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[value.length - 1]?.created_at;
  }

  let getFirstTransJunior = await getFirstPerGradeLevelJunior();
  let getLastTransacJunior = await getLastPerGradeLevelJunior();

  getFirstTransJunior = getFirstTransJunior
    ? getFirstTransJunior
    : new Date().toISOString();
  getLastTransacJunior = getLastTransacJunior
    ? getLastTransacJunior
    : new Date().toISOString();

  if (formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [7, 10])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransJunior.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacJunior.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [7, 10])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransJunior.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacJunior.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  } else if (!formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [7, 10])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransJunior.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo ? formData.dateTo : getLastTransacJunior.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  } else if (!formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [7, 10])
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .where("transactions.ecr_no", "like", `%${formData.initial}%`)
      .groupBy("particular_id");
  }

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export async function allPerGradeLevelSeniorHigh(formData) {
  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .where("paid_particulars.is_reversal", 0);

  async function getFirstPerGradeLevelSeniorHigh() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[0]?.created_at;
  }

  async function getLastPerGradeLevelSeniorHigh() {
    const value = await getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("paid_particulars.is_reversal", 0)
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      );
    return value[value.length - 1]?.created_at;
  }

  let getFirstTransSeniorHigh = await getFirstPerGradeLevelSeniorHigh();
  let getLastTransacSeniorHigh = await getLastPerGradeLevelSeniorHigh();

  getFirstTransSeniorHigh = getFirstTransSeniorHigh
    ? getFirstTransSeniorHigh
    : new Date().toISOString();
  getLastTransacSeniorHigh = getLastTransacSeniorHigh
    ? getLastTransacSeniorHigh
    : new Date().toISOString();

  if (formData.dateFrom && formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [11, 12])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransSeniorHigh.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo
          ? formData.dateTo
          : getLastTransacSeniorHigh.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [11, 12])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransSeniorHigh.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo
          ? formData.dateTo
          : getLastTransacSeniorHigh.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id");
  } else if (formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [11, 12])
      .where(
        "transactions.created_at",
        ">=",
        `${formData.dateFrom
          ? formData.dateFrom
          : getFirstTransSeniorHigh.split("T")[0]
        }T00:00:00Z`
      )
      .where(
        "transactions.created_at",
        "<=",
        `${formData.dateTo
          ? formData.dateTo
          : getLastTransacSeniorHigh.split("T")[0]
        }T23:59:59Z`
      )
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id");
  } else if (!formData.dateFrom && !formData.dateTo) {
    queryBuilder
      .select("enrollments.grade as grade")
      .select("particulars.name as particular")
      .whereBetween("enrollments.grade", [11, 12])
      .orderBy("transactions.created_at")
      .join(
        "transactions",
        "paid_particulars.student_payment_id",
        "transactions.student_payment_id"
      )
      .join("enrollments", "paid_particulars.student_id", "enrollments.id")
      .join("particulars", "paid_particulars.particular_id", "particulars.id")
      .sum("paid_particulars.amount as total")
      .groupBy("particular_id");
  }

  return queryBuilder.catch(offlineDatabaseError).then((data) => data);
}

export function countOfflineTransactions(
  searchQuery,
  searchFields = [
    "ecr_no",
    "or_no",
    "student_no",
    "first_name",
    "middle_name",
    "last_name",
    "transactions.created_at",
  ]
) {
  let queryBuilder = getDatabase()
    .connection("transactions")
    .count("* as total")
    .join(
      "paid_particulars",
      "transactions.student_payment_id",
      "paid_particulars.student_payment_id"
    )
    .join("enrollments", "paid_particulars.student_id", "enrollments.id")
    .groupBy("transactions.student_payment_id");

  if (searchQuery) {
    const words = searchQuery.split(" ");

    searchFields.forEach((field) => {
      words.forEach((word) => {
        queryBuilder.orWhere(field, "like", `%${word}%`);
      });
    });
  }

  return queryBuilder
    .catch(offlineDatabaseError)
    .then((result) => result.length);
}

export function getOfflineTransactionsList(
  pageNumber,
  pageLimit,
  searchQuery,
  initial,
  searchFields = [
    "ecr_no",
    "or_no",
    "student_no",
    "first_name",
    "middle_name",
    "last_name",
    "transactions.created_at",
  ]
) {
  const offsetValue = (pageNumber - 1) * pageLimit;

  let queryBuilder = getDatabase()
    .connection("transactions")
    .select(
      "transactions.id",
      "transactions.ecr_no as ecr_no",
      "transactions.or_no as or_no",
      "transactions.created_at",
      "enrollments.student_no as student_no",
      "enrollments.first_name as first_name",
      "enrollments.middle_name as middle_name",
      "enrollments.last_name as last_name",
      "income_entry.title as title",
      "income_entry.receive_from as receive_from",
      "transactions.amount",
      "transactions.student_payment_id",
      "transactions.is_reversal"
    )
    .leftJoin(
      "student_payments",
      "transactions.student_payment_id",
      "student_payments.id"
    )
    .leftJoin("enrollments", "student_payments.enrollment_id", "enrollments.id")
    .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
    .where("ecr_no", "like", `%${initial}%`)
    .orWhere("ecr_no", null)
    .offset(offsetValue)
    .limit(pageLimit)
    .orderBy("transactions.created_at", "desc");

  if (searchQuery) {
    const words = searchQuery.split(" ");
    searchFields.forEach((field) => {
      words.forEach((word) => {
        queryBuilder.orWhere(field, "like", `%${word}%`);
      });
    });
  }

  return queryBuilder.catch(offlineDatabaseError).then((result) => result);
}

export function getOfflineTransactionsListSearch(
  pageNumber,
  pageLimit,
  searchQuery,
  initial,
  searchFields = [
    "ecr_no",
    "or_no",
    "student_no",
    "first_name",
    "middle_name",
    "last_name",
    "transactions.created_at",
  ]
) {
  const offsetValue = (pageNumber - 1) * pageLimit;

  let queryBuilder = getDatabase()
    .connection("transactions")
    .select(
      "transactions.id",
      "transactions.ecr_no as ecr_no",
      "transactions.or_no as or_no",
      "transactions.created_at",
      "enrollments.student_no as student_no",
      "enrollments.first_name as first_name",
      "enrollments.middle_name as middle_name",
      "enrollments.last_name as last_name",
      "income_entry.title as title",
      "income_entry.receive_from as receive_from",
      "transactions.amount",
      "transactions.student_payment_id",
      "transactions.is_reversal"
    )
    .leftJoin(
      "student_payments",
      "transactions.student_payment_id",
      "student_payments.id"
    )

    .leftJoin("enrollments", "student_payments.enrollment_id", "enrollments.id")
    .leftJoin("income_entry", "income_entry.transaction", "transactions.id")
    .offset(offsetValue)
    .limit(pageLimit)
    .orderBy("transactions.created_at", "desc");

  if (searchQuery) {
    const words = searchQuery.split(" ");
    console.log(searchQuery + "query");

    searchFields.forEach((field) => {
      words.forEach((word) => {
        queryBuilder.orWhere(field, "like", `%${word}%`);
      });
    });
  }

  return queryBuilder.catch(offlineDatabaseError).then((result) => result);
}

export function insertSyncDate(date) {
  const connection = getDatabase().connection("sync");

  return connection.insert({ sync_date: date }).catch(offlineDatabaseError);
}

export function lastestSyncDate() {
  return getDatabase()
    .connection("sync")
    .select("*")
    .orderBy("sync_date", "desc")
    .limit(1)
    .catch(offlineDatabaseError)
    .then((date) => date[0]);
}

export function offlineGetId(tableName, column, search) {
  return getDatabase()
    .connection(tableName)
    .select("id")
    .where(column, `${search}`)
    .catch(offlineDatabaseError)
    .then((data) => data[0]?.id);
}

export function offLineGetAllByName(tableName, column, value) {
  return getDatabase()
    .connection(tableName)
    .select("*")
    .where(column, value)
    .catch(offlineDatabaseError)
    .then((data) => data);
}

export function offlineGetColumn(tableName, column, whereColumn, whereValue) {
  return getDatabase()
    .connection(tableName)
    .select(column)
    .where(whereColumn, whereValue)
    .catch(offlineDatabaseError)
    .then((data) => data[0][column]);
}

export function getOfflineallTransaction(column, value) {
  let queryBuilder = getDatabase()
    .connection("transactions")
    .select(
      "transactions.id as id",
      "transactions.is_reversal as is_reversal",
      "transactions.amount as amount",
      "transactions.created_at as created_at",
      "transactions.ecr_no as ecr_no",
      "transactions.is_synced as is_synced",
      "transactions.or_no as or_no",
      "transactions.student_payment_id as student_payment_id",
      "transactions.to_acct_id as to_acct_id",
      "finance_accounts.name as finance_account",
      "payment_methods.title as payment_method"
    )
    .join(
      "student_payments",
      "transactions.student_payment_id",
      "student_payments.id"
    )
    .join(
      "finance_accounts",
      "student_payments.finance_account_id",
      "finance_accounts.id"
    )
    .join(
      "payment_methods",
      "student_payments.payment_method_id",
      "payment_methods.id"
    );

  if (column) {
    queryBuilder.where(column, value);
  }

  return queryBuilder.catch(offlineDatabaseError).then((result) => result);
}

export function getOfflineLatest(tableName, column, orderBy, initial) {
  return getDatabase()
    .connection(tableName)
    .select(column)
    .orderByRaw(orderBy)
    .limit(1)
    .where("ecr_no", "like", `%${initial}%`)
    .catch(offlineDatabaseError)
    .then((result) =>
      result[0] ? result[0].ecr_no : `ECR-${initial}-0000000000`
    );
}

export async function getOfflineSOA(
  dateFrom,
  dateTo,
  pageNumber,
  pageLimit,
  paymentSchemes,
  payment_plan_items,
  grade,
  section
) {
  const offsetValue = (pageNumber - 1) * pageLimit;

  const transactions = await getDatabase()
    .connection("transactions")
    .select("created_at");

  const firstTransaction = transactions[0]?.created_at?.split("T")[0];
  const lastTransaction =
    transactions[transactions.length - 1]?.created_at?.split("T")[0];

  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .select(
      "enrollments.id",
      "enrollments.student_no",
      "enrollments.first_name",
      "enrollments.last_name",
      "enrollments.grade",
      "enrollments.section",
      "enrollments.payment_scheme_id",
      "transactions.created_at"
    )
    .join("transactions", "paid_particulars.transaction_id", "transactions.id")
    .join("enrollments", "paid_particulars.student_id", "enrollments.id")
    .where(
      "transactions.created_at",
      ">=",
      dateFrom ? `${dateFrom}T00:00:00Z` : `${firstTransaction}T00:00:00Z`
    )
    .where(
      "transactions.created_at",
      "<=",
      dateTo ? `${dateTo}T23:59:59Z` : `${lastTransaction}T23:59:59Z`
    );

  if (grade) {
    queryBuilder.where("grade", grade);
  }

  if (section) {
    queryBuilder.where("section", section);
  }

  return queryBuilder
    .groupBy("paid_particulars.student_id")
    .offset(offsetValue)
    .limit(pageLimit)
    .catch(offlineDatabaseError)
    .then((enrollments) =>
      enrollments.map((enrollment) => {
        const payment_scheme = paymentSchemes.filter(
          (paymentScheme) => paymentScheme.id === enrollment.payment_scheme_id
        )[0];

        const payment_plan_items_list = payment_plan_items.filter(
          (item) => item.payment_plan_id === payment_scheme.paymentPlan
        );

        return {
          ...enrollment,
          payment_plan_items_list,
        };
      })
    );
}

export function countSOA(grade, section) {
  let queryBuilder = getDatabase()
    .connection("paid_particulars")
    .count("* as total")
    .join("transactions", "paid_particulars.transaction_id", "transactions.id")
    .join("enrollments", "paid_particulars.student_id", "enrollments.id")
    .groupBy("paid_particulars.student_id");

  if (grade) {
    queryBuilder.orWhere("grade", grade);
  }

  if (section) {
    queryBuilder.orWhere("section", section);
  }

  return queryBuilder
    .catch(offlineDatabaseError)
    .then((result) => result.length);
}

export function offlineSelectOneTransactionParticular(id) {
  return getDatabase()
    .connection("paid_particulars")
    .select("paid_particulars.amount as amount", "particulars.name as name")
    .where("paid_particulars.transaction_id", id)
    .leftJoin(
      "transactions",
      "paid_particulars.transaction_id",
      "transactions.id"
    )
    .leftJoin("particulars", "paid_particulars.particular_id", "particulars.id")
    .catch(offlineDatabaseError)
    .then((data) => data);
}

export function offlineSelectOneTransactionDetail(id) {
  return (
    getDatabase()
      .connection("transactions")
      .select(
        "transactions.ecr_no as ecr_no",
        "transactions.created_at as date"
      )
      .where("transactions.id", id)
      .leftJoin(
        "transactions",
        "paid_particulars.transaction_id",
        "transactions.id"
      )
      // .sum("paid_particulars.amount as total")
      .groupBy("paid_particulars.transaction_id")
      .catch(offlineDatabaseError)
      .then((data) => data)
  );
}

export function offlineGetCashierInfo(initials) {
  return (
    getDatabase()
      .connection("cashiers")
      .select(
        "full_name"
      )
      .where("initial", initials)
      .catch(offlineDatabaseError)
      .then((data) => data)
  );
}

//new query
export function offlineSelectOnePaidParticulars(id) {
  return (
    getDatabase()
      .connection("paid_particulars")
      .select(
        "*"
      )
      .where("student_id", id)
      .catch(offlineDatabaseError)
      .then((data) => data)
  );
}

//new query is reversal
export function offlineSelectOnePaidParticularsReversal(id) {
  return (
    getDatabase()
      .connection("paid_particulars")
      .select("*")
      .where("student_id", id)
      .andWhere("is_reversal", 0)
      .catch(offlineDatabaseError)
      .then((data) => data)
  );
}

//new query + trasanction
export function offlineSelectOnePaidParticularsTransac(id) {
  return (
    getDatabase()
      .connection("paid_particulars")
      .select(
        "*"
      )
      .where("transaction_id", id)
      .andWhere("is_reversal", 0)
      .catch(offlineDatabaseError)
      .then((data) => data)
  );
}


//check if exist in db
export function OfflineCheckExisting(tableName, columnName, value) {
  return (
    getDatabase()
      .connection(tableName)
      .select(
        "*"
      )
      .where(columnName, value)
      .catch(offlineDatabaseError)
  );
}