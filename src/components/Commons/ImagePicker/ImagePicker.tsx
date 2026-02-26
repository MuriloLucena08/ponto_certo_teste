import React from 'react';
import styles from './ImagePicker.module.css';
import { FaCamera } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';

interface ImagePickerProps {
    images: string[];
    onImagesChange: (imgs: string[]) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ images, onImagesChange }) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newUrls = files.map(f => URL.createObjectURL(f));
            onImagesChange([...images, ...newUrls]);
        }
    };

    const removeImage = (idx: number) => {
        const newImages = [...images];
        newImages.splice(idx, 1);
        onImagesChange(newImages);
    };

    return (
        <div className={styles.imagePicker}>
            <div className={styles.imageList}>
                {images.map((img, idx) => (
                    <div key={idx} className={styles.thumb}>
                        <img src={img} alt="thumb" className={styles.thumbImg} />
                        <button
                            onClick={() => removeImage(idx)}
                            className={styles.removeBtn}
                        >
                            <TiDelete size={20} />
                        </button>
                    </div>
                ))}
            </div>
            <label className={styles.uploadBtn}>
                <FaCamera size={24} />
                <span className={styles.uploadText}>Adicionar Foto</span>
                <input type="file" accept="image/*" multiple onChange={handleFile} hidden />
            </label>
        </div>
    );
};
