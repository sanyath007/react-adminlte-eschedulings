import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Form as BsForm,
  Button,
  Col,
  Row,
  Modal
} from 'react-bootstrap';
import moment from 'moment';

function ShiftModal({ isOpen, hideModal, onSelected, ...props }) {
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
    props.onUpdateScheduleDetail(props.personShifts.id, data)
  };

  /** //TODO: To handle on swap shift button clicked */
  const handleSwapShift = function () {
    console.log(props.shift);
  };

  useEffect(() => {
  }, []);

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
              {props.personShifts && 
                    props.personShifts.person.prefix.prefix_name+props.personShifts.person.person_firstname+ '' +props.personShifts.person.person_lastname
              }
            </p>
            <p className='my-1'>
              <span className='mr-1'>ตำแหน่ง</span>
              {props.personShifts && 
                    props.personShifts.person.position.position_name
              }
            </p>
            <p className='my-1'>
              <span className='mr-1'>ประจำวันที่</span>
              {props.shift && props.shift.shiftDate}
            </p>
            <p className='my-1'>
              <span className='mr-1'>เวร</span>
              {props.shift && props.shift.shiftText}
            </p>

          </Col>
        </Row>
        <Row>
          <Col className='text-center mt-4'>
            <Button variant="primary" className="mr-2" onClick={() => handleOffShift()}>Off เวร</Button>
            <Button variant="success" onClick={() => handleSwapShift()}>เปลี่ยนเวร</Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

ShiftModal.propTypes = {
  isOpen: PropTypes.bool,
  hideModal: PropTypes.func,
  onSelected: PropTypes.func,
};

export default ShiftModal;
