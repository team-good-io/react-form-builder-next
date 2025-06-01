import type { Option } from '../../../types'

export interface OptionsState {
  loading: boolean;
  data?: Option[];
  error?: unknown;
}

export enum OptionsSourceType {
  STATIC = 'static',
  REMOTE = 'remote',
  REMOTE_DYNAMIC = 'remote-dynamic',
}

interface OptionsSourceBase {
  type: OptionsSourceType;
}

interface OptionsSourceRemoteBase extends OptionsSourceBase {
  path: string;
  labelKey?: string;
  valueKey?: string;
  transformResponseFnName?: string; // Optional named transform
}

export interface OptionsSourceStatic extends OptionsSourceBase {
  type: OptionsSourceType.STATIC;
  options: Option[];
}

export interface OptionsSourceRemote extends OptionsSourceRemoteBase {
  type: OptionsSourceType.REMOTE;
}

export interface OptionsSourceRemoteDynamic extends OptionsSourceRemoteBase {
  type: OptionsSourceType.REMOTE_DYNAMIC;
  dependencies: string[];
}

export type OptionsSource = OptionsSourceStatic | OptionsSourceRemote | OptionsSourceRemoteDynamic;

export type OptionsConfig = Record<string, OptionsSource>;

export interface OptionsToolbox {
  publish: (name: string, data: OptionsState) => void;
}

export type OptionsFn = (sourceName: string, values?: Record<string, unknown>) => void | Promise<void>;