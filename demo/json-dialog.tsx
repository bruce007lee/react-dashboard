import { Input, Modal } from 'antd';
import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

type DlgProp = {
  jsonString: string;
  onOk?: (jsonString: string) => void;
  onCancle?: () => void;
  visible?: boolean;
  afterClose?: () => void;
};

const JSONDialog = ({ jsonString, onOk, onCancle, visible: defaultVisible = true, afterClose }: DlgProp) => {
  const [value, setValue] = useState<string>(jsonString);
  const [visible, setVisible] = useState<boolean>(defaultVisible);
  const handleOk = () => {
    if (onOk) {
      onOk(value);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    if (onCancle) {
      onCancle();
    }
    setVisible(false);
  };
  return (
    <Modal
      title="Schema设置"
      onOk={handleOk}
      onCancel={handleCancel}
      visible={visible}
      afterClose={afterClose}
      okText="Apply"
    >
      <Input.TextArea value={value} style={{ width: 500, height: 300 }} onChange={(e) => setValue(e.target.value)} />
    </Modal>
  );
};

JSONDialog.show = ({ onOk, ...others }: DlgProp) => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const onOkProxy = (val) => {
    if (onOk) {
      onOk(val);
    }
  };
  const afterClose = () => {
    unmountComponentAtNode(root);
    document.body.removeChild(root);
  };
  render(<JSONDialog {...others} onOk={onOkProxy} afterClose={afterClose} />, root);
};

export default JSONDialog;
