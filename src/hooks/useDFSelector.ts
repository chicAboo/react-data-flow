/**
 * @author ChicAboo
 * @date 2020/12/30 8:39 下午
 */
import { useRef } from 'react';
import { DataFlowTypes, EdgeTypes } from '@/typings';

export interface Callbacks<Values = any> {
  onFinish?: (values: Values) => void;
  setEdgeCallback?: (values: Values) => void;
}

export interface InternalHooks {
  setCallbacks: (callbacks: Callbacks) => void;
}

interface DFInstance {
  submit: () => void;
  setCallbacks: (callbacks: Callbacks) => void;
  setFields: (values: DataFlowTypes) => void;
  setEdgeValues: (data: any) => void;
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
    setEdgeValues: this.setEdgeValues,
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
   *  set field data
   * */
  private setFields = (values: DataFlowTypes) => {
    this.fields = values;
  };

  /**
   *  get field data
   * */
  private getDfValues = (): DataFlowTypes | null => {
    return this.fields;
  };

  /**
   *  echo edge to setting
   * */
  private setEdgeValues = (data: EdgeTypes) => {
    const setEdgeCallback = this.callbacks.setEdgeCallback;
    if (setEdgeCallback) {
      try {
        setEdgeCallback(data);
      } catch (err) {
        console.error(err);
      }
    }
  };
}

/**
 *  bind the data flow instance to useRef
 * */
const useDFSelector = (dFlow?: DFInstance) => {
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
