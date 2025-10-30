import { Button, Card, CardBody } from "reactstrap";
import { TimeSlot } from "./types";
import { format, parseISO } from "date-fns";

interface TimeSlotProps {
    slot: TimeSlot;
    onEdit: () => void;
    onDelete: () => void;
}
const TimeSlotComponent: React.FC<TimeSlotProps> = ({ slot, onEdit, onDelete}) => {
 
    return (
        <Card className='mb2'>
            <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                    <strong>{format(slot.dataHora, 'HH:mm')}</strong>
                    <div className="d-flex gap-1">
                        <Button size="sm" className="btn-custom-info" onClick={onEdit}>
                            Editar
                        </Button>
                        <Button size="sm" className="btn-custom-danger" onClick={onDelete}>
                            Excluir
                        </Button>
                    </div>
                </div>
                <h6 className="mt-2 mb-1">{slot.cliente?.nome}</h6>
                <p className="mb-0 small text-muted">
                    {slot.servico?.nome} - R$ {slot.valorServico?.toFixed(2)}
                </p>
                {slot.observacoes && <p className="mb-0 small fst-italic">Obs: {slot.observacoes}</p>}
            </CardBody>
        </Card>
    );
};

export default TimeSlotComponent;