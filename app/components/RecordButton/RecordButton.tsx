import React from 'react';
import styles from '../../RecordButton.module.css';

interface RecordButtonProps {
  recording: boolean;
  onClick: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ recording, onClick }) => {
  return (
    <button className={styles.recordButton} onClick={onClick}>
      {recording ? 'Parar Gravação' : 'Iniciar Gravação'}
    </button>
  );
};

export default RecordButton;
