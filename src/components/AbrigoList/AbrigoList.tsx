import { IAbrigo } from '../../types/Ponto';
import styles from './AbrigoList.module.css';
import { ABRIGO_TYPES } from '../../data/abrigoTypes';
import { IoAdd, IoHome } from 'react-icons/io5';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { Switch } from '../Commons/Switch/Switch';
import { Section } from '../Commons/Section/Section';
import { ImagePicker } from '../Commons/ImagePicker/ImagePicker';

interface AbrigoListProps {
    abrigos: IAbrigo[];
    setAbrigos: (val: IAbrigo[]) => void;
}

export const AbrigoList = ({ abrigos, setAbrigos }: AbrigoListProps) => {

    const addAbrigo = () => {
        setAbrigos([...abrigos, {
            idTipoAbrigo: undefined,
            temPatologia: false,
            imgBlobPaths: [],
            imagensPatologiaPaths: []
        }]);
    };

    const removeAbrigo = (index: number) => {
        const newAbrigos = [...abrigos];
        newAbrigos.splice(index, 1);
        setAbrigos(newAbrigos);
    };

    const updateAbrigo = (index: number, field: keyof IAbrigo, value: any) => {
        const newAbrigos = [...abrigos];
        newAbrigos[index] = { ...newAbrigos[index], [field]: value };
        setAbrigos(newAbrigos);
    };

    return (
        <div className={styles.abrigosSection}>
            <div className={styles.headerRow}>
                <Section icon={<IoHome size={24} />} title={`Abrigos (${abrigos.length})`}>
                    {null}
                </Section>
                <button onClick={addAbrigo} className={styles.addButton} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                    <IoAdd size={22} /> <h4>Adicionar</h4>
                </button>
            </div>

            {abrigos.map((abrigo, index) => (
                <div key={index} className={styles.abrigoCard}>
                    <div className={styles.cardHeader}>
                        <span>Abrigo #{index + 1}</span>
                        <button onClick={() => removeAbrigo(index)} className={styles.removeBtn} title="Remover abrigo">
                            <BiSolidTrashAlt size={19} />
                        </button>
                    </div>

                    <div className={styles.cardBody}>
                        {/* Type Selector */}
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Tipo de Abrigo</label>
                            <select
                                value={abrigo.idTipoAbrigo || ''}
                                onChange={(e) => updateAbrigo(index, 'idTipoAbrigo', parseInt(e.target.value))}
                                className={styles.select}
                            >
                                <option value="">Selecione...</option>
                                {ABRIGO_TYPES.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Picker */}
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Fotos do Abrigo</label>
                            <ImagePicker
                                images={abrigo.imgBlobPaths}
                                onImagesChange={(imgs) => updateAbrigo(index, 'imgBlobPaths', imgs)}
                            />
                        </div>

                        {/* Patologia */}
                        <div className={styles.patologiaSwitch}>
                            <Switch
                                label="Possui Patologia?"
                                value={abrigo.temPatologia}
                                onChange={(val) => updateAbrigo(index, 'temPatologia', val)}
                            />
                        </div>

                        {abrigo.temPatologia && (
                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Fotos da Patologia</label>
                                <ImagePicker
                                    images={abrigo.imagensPatologiaPaths}
                                    onImagesChange={(imgs) => updateAbrigo(index, 'imagensPatologiaPaths', imgs)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
