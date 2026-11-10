import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from '../types/auth'
import { apiGet, apiPut } from './client'

export function fetchMyProfile() {
  return apiGet<UserProfile>('/users/me')
}

export function updateMyProfile(data: UpdateProfileRequest) {
  return apiPut<UserProfile>('/users/me', data)
}

export function changeMyPassword(data: ChangePasswordRequest) {
  return apiPut<void>('/users/me/password', data)
}