import { MMKV } from 'react-native-mmkv'

// keys
const AppMMKVID = 'Wheel-well-id'
export const token = 'USER_TOKEN'

export const mmkvStorage = new MMKV({
    id: AppMMKVID,
})

export const setUser = (user) => {
    console.log(user, 'user')
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
    return userObject?.user
}
export const deleteUser = () => {
    mmkvStorage.delete(token)
}