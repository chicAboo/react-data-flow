/**
 * @author ChicAboo
 * @date 2020/12/30 8:39 下午
 */
import { useRef } from 'react';
import { DataFlowTypes } from '@/typings';

export interface Callbacks<Values = any> {
  onFinish?: (values: Values) => void;
}

export interface InternalHooks {
  setCallbacks: (callbacks: Callbacks) => void;
}

interface DFInstance {
  submit: () => void;
  setCallbacks: (callbacks: Callbacks) => void;
  setFields: (values: DataFlowTypes) => void;
  getDfValues: () => DataFlowTypes | null;
}

class DFStore {
  private callbacks: Callbacks = {};
  fields: DataFlowTypes | null;

  constructor() {
    this.fields = null;
  }

  /**
   *  exposed example method
   * */
  public getDfFunctions = (): DFInstance => ({
    submit: this.submit,
    setFields: this.setFields,
    setCallbacks: this.setCallbacks,
    getDfValues: this.getDfValues,
  });

  /**
   *  set callback function, such as: onFinish
   * */
  private setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = callbacks;
  };

  /**
   * execute submit to trigger onFinish event
   * */
  private submit = () => {
    const { onFinish } = this.callbacks;
    const values = this.fields;

    if (onFinish) {
      try {
        onFinish(values);
      } catch (err) {
        // Should print error if user `onFinish` callback failed
        console.error(err);
      }
    }
  };

  /**
   *  set field
   * */
  private setFields = (values: any) => {
    this.fields = values;
  };

  private getDfValues = () => {
    return this.fields;
  };
}

/**
 *  bind the data flow instance to useRef
 * */
const useDFSelector = (dFlow?: any) => {
  const dfRef = useRef<DFInstance>();

  if (!dfRef.current) {
    if (dFlow) {
      dfRef.current = dFlow;
    } else {
      const dfInstance = new DFStore();
      dfRef.current = dfInstance.getDfFunctions();
    }
  }

  return [dfRef.current];
};

export default useDFSelector;
