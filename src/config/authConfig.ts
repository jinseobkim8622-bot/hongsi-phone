// ========================================================
// 홍시폰 V2 접근 제어 및 중앙 인증 관리
// ========================================================

export const ADMIN_MASTER_KEY = 'happy2me';
export const ADMIN_MASTER_KEYS = ['happy2me', 'admin8888'];
export const DEFAULT_PASSWORDS = ['8622', 'hongsi2026', '7777'];

export interface ServerAuthInfo {
  activePassword: string;
  version: number;
}

/**
 * 관리자 마스터 키 검증 (대소문자 무관)
 */
export function verifyAdminMasterKey(key: string): boolean {
  if (!key) return false;
  const k = key.trim().toLowerCase();
  return ADMIN_MASTER_KEYS.some((m) => m.toLowerCase() === k);
}

/**
 * 서버에 저장된 최신 비밀번호 정보 조회
 */
export async function fetchServerAuthInfo(): Promise<ServerAuthInfo | null> {
  try {
    const res = await fetch('/api/auth/info', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // 오프라인이거나 단일 파일 모드일 때
  }
  return null;
}

/**
 * 로컬 또는 서버 비밀번호 검증
 */
export function verifyPasswordMatch(input: string, activePassword?: string): boolean {
  if (!input) return false;
  const clean = input.trim();
  const lower = clean.toLowerCase();

  // 1. 관리자 마스터 키는 언제나 통과
  if (verifyAdminMasterKey(clean)) {
    return true;
  }

  // 2. 서버에서 전달받은 현재 활성 비밀번호 비교
  if (activePassword && activePassword.trim()) {
    return lower === activePassword.trim().toLowerCase();
  }

  // 3. 로컬 기본값 검사
  return DEFAULT_PASSWORDS.some((p) => p.toLowerCase() === lower);
}

/**
 * 관리자가 새 비밀번호를 설정 (서버에 실시간 동기화)
 */
export async function updateServerPassword(
  adminKey: string,
  newPass: string
): Promise<{ success: boolean; message: string }> {
  const cleanAdmin = (adminKey || '').trim();
  const cleanPass = (newPass || '').trim();

  if (!verifyAdminMasterKey(cleanAdmin)) {
    return {
      success: false,
      message: '관리자 마스터 키가 일치하지 않습니다. 관리자 권한이 없습니다.',
    };
  }

  if (!cleanPass) {
    return {
      success: false,
      message: '새로 설정할 비밀번호를 입력해주세요.',
    };
  }

  try {
    const res = await fetch('/api/auth/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminKey: cleanAdmin, newPassword: cleanPass }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hongsiphone_custom_password', cleanPass);
        localStorage.setItem('hongsiphone_session_pass', cleanPass);
      }
      return {
        success: true,
        message: data.message || `새 비밀번호가 [${cleanPass}] 로 변경되었습니다!`,
      };
    } else {
      return {
        success: false,
        message: data.message || '비밀번호 변경에 실패했습니다.',
      };
    }
  } catch (err) {
    // 서버가 없는 오프라인 모드일 경우 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('hongsiphone_custom_password', cleanPass);
      localStorage.setItem('hongsiphone_session_pass', cleanPass);
    }
    return {
      success: true,
      message: `새 비밀번호가 [${cleanPass}] 로 로컬에 저장되었습니다.`,
    };
  }
}
