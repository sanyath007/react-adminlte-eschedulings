import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Row,
  Modal
} from 'react-bootstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import api from '../../api';
import DailyColumns from '../../components/DailyColumns';
import ShiftsOfDay from '../../components/ShiftsOfDay';
import './styles.css';

function OtModal({
  isOpen,
  hideModal,
  schedule,
  month,
  holidays,
  ...props
}) {
  const [daysOfMonth, setDaysOfMonth] = useState(31);
  const [ot, setOt] = useState([]);
  const [otShifts, setOtShifts] = useState([]);

  useEffect(() => {
    if (schedule) {
      const { id, person, ot_shifts } = schedule;
      const shifts = ot_shifts ? ot_shifts.split(',') : [];

      setDaysOfMonth(moment(month).endOf('month').date());
      setOtShifts(shifts);

      if (ot_shifts) {
        setOt([{id, person_id: person.person_id, shifts}]);
      }
    }
  }, [schedule]);

  const handleSubmitOT = async (id, ot_shifts, totalShift, OT) => {
    if (window.confirm(`คุณต้องการบันทึกการระบุวัน OT ใช่หรือไม่ ?`)) {
      const working = parseFloat(totalShift, 10) - parseFloat(OT, 10);
      const data = { ot_shifts, total_shift: parseFloat(totalShift, 10), working, ot: OT };

      let res = await api.put(`/api/schedule-details/${id}/ot`, data);

      if (res.data.status === 1) {
          toast.success('บันทึกข้อมูลเรียบร้อย !!!', { autoClose: 1000, hideProgressBar: true });
      } else {
          toast.error('พบข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้ !!!', { autoClose: 1000, hideProgressBar: true });
      }
    }
  };

  const handleOnSetOT = (scheduleDetail, date, shift, isOt) => {
    const { id, person_id, ...other } = scheduleDetail;
    const personOt = ot.find(o => o.id === id);

    if (personOt) {
        const newPersonOt = personOt.shifts.map((sh, i) => {
            if (i+1 === date) {
                if (sh !== '') {
                  let arrShifts = sh.split('|');

                  /** On deselected case  */
                  if (arrShifts.length > 1 && !isOt) {
                    return sh = arrShifts.filter(ar => ar !== shift).toString();
                  }

                  return sh = isOt ? `${sh}|${shift}` : '';
                }

                return sh = isOt ? shift : '';
            }

            return sh;
        });

        const newOt = ot.map(o => {
            if (o.id === id) {
                o.shifts = newPersonOt;
            }

            return o;
        });

        setOt(newOt);
    } else {
        let newShifts = scheduleDetail.shifts.split(',').map((sh, i) => {
            if (i+1 === date) {
                return isOt ? shift : '';
            }

            return sh = '';
        });

        const newOt = [...ot, { id, person_id, shifts: newShifts }];

        setOt(newOt);
    }
  };

  const renderTotalShift = (shifts, ot) => {
      let totalShift = 0;
      shifts.split(',').forEach((sh, index) => {
          sh.split('|').forEach(s => {
              if (s !== '') {
                  totalShift += 1;
              }
          });
      });

      let sumOT = 0;
      if (ot) {
          sumOT = ot.shifts.reduce((sum, curVal) => {
              if (curVal !== '') {
                  return sum += 1;
              }

              return sum;
          }, 0);
      }

      return <span>{totalShift - sumOT}</span>;
  };

  const renderOT = (ot) => {
      let sumOT = 0;
      if (ot) {
          sumOT = ot.shifts.reduce((sum, curVal) => {
              if (curVal !== '') {
                  return sum += 1;
              }

              return sum;
          }, 0);
      }

      return (
          <span>{sumOT}</span>
      );
  };

  return (
    <Modal
      show={isOpen}
      onHide={hideModal}
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>แบบฟอร์มระบุวัน OT</Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div className="table-responsive">
              <table className="table table-bordered table-striped mb-1" style={{ fontSize: '14px' }}>
                {/* TODO: Duplicated code */}
                <thead>
                  <tr>
                    <td style={{ textAlign: 'center' }} rowSpan="2">ชื่อ-สกุล</td>
                    <td style={{ textAlign: 'center' }} colSpan={ daysOfMonth }>วันที่</td>
                    <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">วันทำการ</td>
                    <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">OT</td>
                  </tr>
                  <DailyColumns
                    month={month ? month : moment().format('YYYY-MM')}
                    holidays={holidays}
                  />
                </thead>
                {/* TODO: Duplicated code */}
                <tbody>
                  {schedule && (
                    <tr>
                      <td>
                        {schedule.person.prefix.prefix_name+schedule.person.person_firstname+ ' ' +schedule.person.person_lastname}
                        <p style={{ color: 'grey', margin: '0px' }}>
                          {schedule.person.position.position_name}
                        </p>
                      </td>
                      {schedule.shifts.split(',').map((shift, index) => {
                        return (
                          <td key={index} style={{ textAlign: 'center', fontSize: 'small', padding: '0px' }}>
                            <ShiftsOfDay
                              shifts={ shift }
                              otShift={otShifts.length > 0 ? otShifts[index] : ''}
                              onSetOT={(sh, isOt) => {
                                handleOnSetOT(schedule, index+1, sh, isOt)
                              }}
                            />
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'center' }}>
                        {renderTotalShift(schedule.shifts, ot.find(o => o.id == schedule.id))}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {renderOT(ot.find(o => o.id == schedule.id))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className='text-center mt-4'>
            <Button variant="primary" className="mr-2" onClick={() => handleSubmitOT()}>
              บันทึก
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

OtModal.propTypes = {
  isOpen: PropTypes.bool,
  hideModal: PropTypes.func,
  schedule: PropTypes.object,
  month: PropTypes.string,
  holidays: PropTypes.array
};

export default OtModal;
