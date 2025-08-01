import { Button, Card, CardBody } from "reactstrap";
import { TimeSlot } from "./types";

interface TimeSlotProps {
    slot: TimeSlot;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}
const TimeSlotComponent: React.FC<TimeSlotProps> = ({ slot, onEdit, onDelete}) => {
 
    return (
        <Card className='mb2'>
            <CardBody>
                <div className="d-flex justify-content-between">
                    <strong>{slot.time}</strong>
                    <div>
                        <Button size="sm" className="btn-custom-info" onClick={() => onEdit(slot.id)}>
                            Editar
                        </Button>
                        <Button size="sm" className="btn-custom-danger" onClick={() => onDelete(slot.id)}>
                            Excluir
                        </Button>
                    </div>
                </div>
                <h6 className="mt-2">{slot.title}</h6>
                {slot.description  && <p className="mb-0">{slot.description}</p>}
            </CardBody>
        </Card>
    );
};

export default TimeSlotComponent;