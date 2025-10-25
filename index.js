import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent는 앱의 루트 컴포넌트를 등록합니다.
// Expo의 네이티브 런타임이 이 컴포넌트를 앱의 진입점으로 사용합니다.
registerRootComponent(App);

// 웹 환경을 위한 default export
export default App;
