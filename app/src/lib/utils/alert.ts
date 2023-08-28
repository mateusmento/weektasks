import { ElMessage } from 'element-plus';

export class Alert {
  static info(message: string) {
    ElMessage({ type: 'info', message });
  }

  static success(message: string) {
    ElMessage({ type: 'success', message });
  }

  static warning(message: string) {
    ElMessage({ type: 'info', message });
  }

  static error(message: string) {
    ElMessage({ type: 'error', message });
  }
}
