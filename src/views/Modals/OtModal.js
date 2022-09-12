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
import { useDispatch } from 'react-redux';
import api from '../../api';
import { calculateShiftsTotal } from '../../utils';
import DailyColumns from '../../components/DailyColumns';
import ShiftsOfDay from '../../components/ShiftsOfDay';
import { updateOT } from '../../features/scheduleDetails';
import './styles.css';

function OtModal({
  isOpen,
  hideModal,
  schedule,
  month,
  holidays,
  workingDays,
  ...props
}) {
  const dispatch = useDispatch();
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

  useEffect(() => {
    /** Clear ot state on component did mounted */
    setOt([]);
  }, [isOpen]);

  const handleSubmitOT = async (id, totalShift, personOT) => {
    if (window.confirm(`คุณต้องการบันทึกการระบุวัน OT ใช่หรือไม่ ?`)) {
      const count = personOT ? countOT(personOT) : 0;
      const working = totalShift - count;
      const { morn, even, night, bd } = personOT
                                          ? calculateShiftsTotal(personOT.shifts)
                                          : { morn: 0, even: 0, night: 0, bd: 0 };
      const data = {
        ot_shifts: personOT ? personOT.shifts : '',
        ot: count,
        m: morn,
        e: even,
        n: night,
        b: bd,
        working
      };

      let res = await api.put(`/schedule-details/${id}/ot`, data);

      if (res.data.status === 1) {
        toast.success('บันทึกข้อมูลเรียบร้อย !!!', { autoClose: 1000, hideProgressBar: true });
        dispatch(updateOT(res.data.detail));

        hideModal();
      } else {
        toast.error('พบข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้ !!!', { autoClose: 1000, hideProgressBar: true });
      }
    }
  };

  const handleSetOT = (scheduleDetail, date, shift, isOt) => {
    const { id, person_id, ...other } = scheduleDetail;
    const personOt = ot.find(o => o.id === id);

    if (personOt) {
      console.log('If personOt is not null...');
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
      console.log('If personOt is null...');
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

  const countOT = (personOT) => {
    if (personOT) {
      return personOT.shifts.reduce((sum, curVal) => {
        if (curVal !== '') {
          /** TODO: Duplicated code in renderWorking function */
          let arrShifts = curVal.split('|');
          let count  = arrShifts.reduce((acc, sh) => {
            if (sh === 'B') {
              return acc += 0.5;
            }

            return acc += 1;
          }, 0);
          /** TODO: Duplicated code in renderWorking function */

          return sum += count;
        }

        return sum;
      }, 0);
    }

    return 0;
  };

  const renderWorking = (shifts, personOT) => {
    let totalShift = {
      night: 0,
      morn: 0,
      even: 0,
      bd: 0,
      total: 0
    };

    /** Calculate total of each ot shifts */
    const { morn, even, night, bd } = (personOT)
                                        ? calculateShiftsTotal(personOT.shifts)
                                        : { morn: 0, even: 0, night: 0, bd: 0 };

    /** Calculate summary of each all shifts */
    shifts.split(',').forEach((shift, index) => {
      shift.split('|').forEach(sh => {
        if (sh !== '') {
          if (sh === 'B') {
            totalShift.total += 0.5;
          } else {
            if (['ด','ด*','ด**','ด^'].includes(sh)) {
              totalShift.night += 1;
            } else if (['ช','ช*','ช**','ช^','Vac'].includes(sh)) {
              totalShift.morn += 1;
            } else if (['บ','บ*','บ**','บ^'].includes(sh)) {
              totalShift.even += 1;
            } else if (['B','B*','B**','B^'].includes(sh)) {
              totalShift.bd += 0.5;
            }

            totalShift.total += 1;
          }
        }
      });
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <span>ช={totalShift.morn - morn}</span>
        <span>บ={totalShift.even - even}</span>
        <span>ด={totalShift.night - night}</span>
        <span>B={totalShift.bd - bd}</span>
        <span>รวม={totalShift.total - countOT(personOT)}</span>
      </div>
    );
  };

  const renderOT = (personOT) => {
    return <span>{countOT(personOT)}</span>;
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
                    <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">
                      ทำการ {workingDays} วัน
                    </td>
                    <td style={{ width: '3%', textAlign: 'center' }} rowSpan="2">OT</td>
                  </tr>
                  <DailyColumns
                    month={month ? month : moment().format('YYYY-MM')}
                    holidays={holidays}
                    cols={daysOfMonth}
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
                              asShiftText
                              shifts={ shift }
                              otShift={otShifts.length > 0 ? otShifts[index] : ''}
                              onSetOT={(sh, isOt) => {
                                handleSetOT(schedule, index+1, sh, isOt)
                              }}
                            />
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'center' }}>
                        {renderWorking(schedule.shifts, ot.find(o => o.id == schedule.id))}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleSubmitOT(schedule.id, schedule.total, ot.find(o => o.id == schedule.id))}>
          บันทึก
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

OtModal.propTypes = {
  isOpen: PropTypes.bool,
  hideModal: PropTypes.func,
  schedule: PropTypes.object,
  month: PropTypes.string,
  holidays: PropTypes.array,
  workingDays: PropTypes.number,
};

export default OtModal;
