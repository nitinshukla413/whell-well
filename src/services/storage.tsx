import { MMKV } from 'react-native-mmkv'

// keys
const AppMMKVID = 'Wheel-well-id'
export const token = 'USER_TOKEN'
export const userData = 'USER_DATA'

export const mmkvStorage = new MMKV({
    id: AppMMKVID,
})
export const getUserMMKVData = () => {
    const serializedUser = mmkvStorage.getString(userData);
    if (!serializedUser) {
        return undefined
    }
    const userObject = JSON.parse(serializedUser);
    if (!userObject) {
        return undefined
    }
    return userObject
}
export const setUserData = (user) => {
    const userStringfy = JSON.stringify(user);
    mmkvStorage.set(userData, userStringfy)
}
export const setUser = (user) => {
    const userStringfy = JSON.stringify(user);
    mmkvStorage.set(token, userStringfy)
}
export const getUser = () => {
    const serializedUser = mmkvStorage.getString(token);
    if (!serializedUser) {
        return {}
    }
    const userObject = JSON.parse(serializedUser);
    if (!userObject) {
        return {}
    }
    return userObject
}
export const deleteUser = () => {
    mmkvStorage.delete(token)
    mmkvStorage.delete(userData)
}
