import {
    offlineDatabaseError,
    offlineUpdateOrInsert,
} from "./base";
import { Users } from "../entity/Users";
import axios from "axios";

const tableName = "users"

function getDatabase() {
    const { remote } = window.require("electron");
    return remote.getGlobal("database");
}

export function saveUser(entity) {
    return offlineUpdateOrInsert(tableName, entity);
}

export function saveUsers(entities) {
    return entities.forEach((entity) => {
        saveUser(entity);
    });
}


const pbkdf2 = require('pbkdf2-sha256');
export function validatePassword(key, string) {
    const parts = string.split('$');
    const iterations = parts[1];
    const salt = parts[2];
    return pbkdf2(key, new Buffer(salt), iterations, 32).toString('base64') === parts[3];
};

export function offlineLogin(username, password) {
    if (!username | !password) {
        return ({
            'message_fill': 'All fields are required to be fill',
        });
    }
    const connection = getDatabase().connection("users");
    return connection
        .select("*")
        .where("username", username)
        .catch(offlineDatabaseError)
        .then((user) => {
            if (user.length) {
                if (validatePassword(password, user[0].password)) {
                    if (user[0].is_cashier)
                    {
                        return user[0]
                    }else{
                        return ({
                            'message_not_cashier': 'Your account must be "Cashier" to be login.',
                        });
                    }

                    
                } else {
                    return ({
                        'message': 'Wrong password',
                    });
                }
            } else {
                return false;
            }
        });
}


export function offlineLoginUser(username, password) {
    if (!username | !password) {
        return ({
            'message_fill': 'All fields are required to be fill',
        });
    }
    const connection = getDatabase().connection("users");
    return connection
        .select("*")
        .where("username", username)
        .catch(offlineDatabaseError)
        .then((user) => {
            if (user.length) {
                if (validatePassword(password, user[0].password)) {
                        return user[0]
                    
                } else {
                    return ({
                        'message': 'Wrong password',
                    });
                }
            } else {
                return false;
            }
        });
}
