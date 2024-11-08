import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const webviewerInstance = useRef();
  const [webviewerInstanceExists, setWebviewerInstanceExists] = useState(false);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)
    WebViewer.WebComponent(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/checkbox-radio-test.pdf',
        licenseKey: 'your_license_key',  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current,
    ).then((instance) => {
      webviewerInstance.current = instance;
      setWebviewerInstanceExists(true);
    });
  }, []);

  const onFormFieldChanged = (name, value) => {
    console.log('Field changed:', name, value);
  }


  useEffect(() => {
    const handleFieldChanged = async (firstarg, value) => {
      const name = firstarg.name;
      console.log(">>>>>>> ~ handleFieldChanged ~ name:", name)

      const type = firstarg.type;
      console.log(">>>>>>> ~ handleFieldChanged ~ type:", type)
      
      const flags = firstarg.flags;
      // console.log(">>>>>>> ~ handleFieldChanged ~ flags:", flags)
      const isRadio = flags?.get('Radio');
      console.log(">>>>>>>>> isRadio", isRadio)

      let valueToSave = value;

      if (type === 'Btn' && !isRadio) {
        valueToSave = value !== 'Off';
      }
      console.log(">>>>>>> ~ handleFieldChanged ~ valueToSave:", valueToSave)

      onFormFieldChanged?.({ name, value: valueToSave });
    };

    if (webviewerInstance.current && onFormFieldChanged) {
      const instance = webviewerInstance.current;
      instance.Core.annotationManager.addEventListener(
        'fieldChanged',
        handleFieldChanged
      );

    }
    return () => {
      if (webviewerInstance.current) {
        const instance = webviewerInstance.current;
        instance.Core.annotationManager.removeEventListener(
          'fieldChanged',
          handleFieldChanged
        );

      }
    };
  }, [onFormFieldChanged, webviewerInstanceExists]);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
