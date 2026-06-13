export const MOCK_CREDENTIALS = {
  username: "root",
  password: "147258369",
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
    return { success: true, user: { name: "root" } }
  }

  return { success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" }
}
