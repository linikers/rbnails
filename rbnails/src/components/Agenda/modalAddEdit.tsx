import { useState } from "react";
import { TimeSlot } from "./types";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface AddEditModalProps {
    isOpen: boolean;
    toggle: () => void;
    onSave: (slot: TimeSlot) => void;
    initialData?: TimeSlot | null;
    day: string;
}
const  AddEditModal: React.FC<AddEditModalProps> = ({
    isOpen, 
    toggle, 
    onSave, 
    initialData,
    day
}) => {
    const [formData, setFormData] = useState<TimeSlot>(initialData || {
        id: '',
        time: '',
        title: '',
        description: '',
        color: '#f8f9fa'
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const slotToSave = {
            ...formData,
            id: initialData?.id || Date.now().toString()
        };
        onSave(slotToSave);
        toggle();
    }

    return (
        <Modal>
            <ModalHeader>
                {initialData ? 'Editar Horário' : `Adicionar Horário - ${day}`}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
                <ModalBody>
                    <FormGroup>
                        <Label for="time">Horário</Label>
                        <Input 
                            type="time"
                            name="time"
                            id="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="title">Título</Label>
                        <Input 
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Descrição</Label>
                        <Input
                        type="textarea"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="color">Cor</Label>
                        <Input
                        type="color"
                        name="color"
                        id="color"
                        value={formData.color}
                        onChange={handleChange}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                    <Button color="primary" type="submit">Salvar</Button>
                </ModalFooter>
            </Form>
        </Modal>   
    )
};

export default AddEditModal;