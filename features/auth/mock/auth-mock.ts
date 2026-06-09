export const MOCK_CREDENTIALS = {
  username: "ames",
  password: "iloveames",
}

export type MockLoginResult =
  | { success: true; user: { name: string } }
  | { success: false; error: string }

export async function mockLogin(
  username: string,
  password: string
): Promise<MockLoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (
    username === MOCK_CREDENTIALS.username &&
    password === MOCK_CREDENTIALS.password
  ) {
    return { success: true, user: { name: "ames" } }
  }

  return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" }
}
