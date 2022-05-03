import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import {
  Button,
  Col,
  Row,
  Modal
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { swap } from '../../features/scheduleDetails';

function ShiftModal({ isOpen, hideModal, onOffShift, ...props }) {
  const dispatch = useDispatch();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');

  /** Handle on off shift button clicked */
  const handleOffShift = function () {
    const newShiftsText = props.personShifts.shifts.split(',').map((shift, index) => {
      if (parseInt(moment(props.shift.shiftDate).format('DD')) === (index+1)) {
        return shift.replace(props.shift.shiftText, '');
      }

      return shift;
    });

    /** TODO: Calculate total_persons and total_shifts */

    const { shifts, ...rest } = props.personShifts
    const data = { ...rest, shifts: newShiftsText.join() };

    /** Pass updating data up to parent */
    if (window.confirm(`คุณต้องการ Off เวรใช่หรือไม่ ?`)) {
      const { created_at, updated_at, person, ...oth } = data;
      console.log(props.personShifts.id, { ...oth, reason });

      // dispatch(swap(props.personShifts.id, { ...oth, reason }));
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={hideModal}
      size="md"
      style={{ top: '50px', zIndex: '1500' }}
    >
      <Modal.Header closeButton>รายละเอียดเวร</Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <p className='my-1'>
              <span className='mr-1'>ชื่อ-สกุล</span> 
              <b>
                {props.personShifts && 
                  props.personShifts.person.prefix.prefix_name+props.personShifts.person.person_firstname+ '' +props.personShifts.person.person_lastname
                }
              </b>
            </p>
            <p className='my-1'>
              <span className='mr-1'>ตำแหน่ง</span>
              <b>{props.personShifts && props.personShifts.person?.position?.position_name}</b>
              <b>{props.personShifts && props.personShifts.person?.academic?.ac_name}</b>
            </p>
            <p className='my-1'>
              <span className='mr-1'>ประจำวันที่</span>
              <b>{props.shift && props.shift.shiftDate}</b>
              <span className='mx-2'>เวร</span>
              <b>{props.shift && props.shift.shiftText}</b>
            </p>

          </Col>
        </Row>
        {showReason && <Row>
          <Col>
              <div className="form-group">
                <label htmlFor="">เหตุผลการ Off เวร :</label>
                <textarea
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="4"
                  className="form-control"
                ></textarea>
              </div>
          </Col>
        </Row>}
        {!showReason ? (
        <Row>
          <Col className='text-center mt-4'>
            <Button variant="primary" className="mr-2" onClick={() => setShowReason(true)}>
              Off เวร
            </Button>
            <Link
              to={`/person-shifts/${props.shift.shiftId}/${props.shift.shiftDate}/${props.shift.shiftText}/swapping`}
              className='btn btn-success'
            >
              เปลี่ยนเวร
            </Link>
          </Col>
        </Row>
        ) : (
          <Row>
            <Col className='text-center mt-4'>
              <Button variant="primary" className="mr-2" onClick={() => handleOffShift()}>
                Off เวร
              </Button>
              <Button variant="danger" className="mr-2" onClick={() => setShowReason(false)}>
                ยกเลิก
              </Button>
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
}

ShiftModal.propTypes = {
  isOpen: PropTypes.bool,
  hideModal: PropTypes.func,
  onOffShift: PropTypes.func,
};

export default ShiftModal;
