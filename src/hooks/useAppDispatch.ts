// hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

const useAppDispatch = () => useDispatch<AppDispatch>();

export { useAppDispatch };
