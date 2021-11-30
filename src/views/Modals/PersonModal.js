import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form as BsForm,
  Button,
  Col,
  Row,
  Modal,
  Pagination
} from 'react-bootstrap';
import moment from 'moment';
import api from '../../api';
import { calcAge } from '../../utils';

function PersonModal({ isOpen, hideModal, onSelected }) {
  const [persons, setPersons] = useState([]);
  const [pager, setPager] = useState(null);

  const fetchPersons = async () => {
    let res = await api.get(`/api/persons`);

    setPersons(res.data.items);
    setPager(res.data.pager);
  };

  const fetchIpAllWithPage = async (url) => {
    let res = await api.get(url);

    setPersons(res.data.items);
    setPager(res.data.pager);
  };

  const handlePaginationClick = (url) => {
    fetchIpAllWithPage(url);
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <Modal
      show={isOpen}
      onHide={hideModal}
      size="xl"
      style={{ top: '50px', zIndex: '1500' }}
    >
      <Modal.Header closeButton>กรุณาเลือกผู้ป่วย</Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div className="form-group col-md-6 pl-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">กรองข้อมูล</span>
                </div>
                <BsForm.Control
                  as="select"
                  name="dch_type"
                  onChange={(e) => {
                    let ward = e.target.value === '' ? '' : `&ward=${e.target.value}`;

                    // fetchIpAll('?dchdate=1', ward);
                  }}
                >
                  <option value="">แสดงทั้งหมด</option>
                  <option value="06">วอร์ดชั้น 1</option>
                  <option value="00">วอร์ดชั้น 10</option>
                  <option value="05">วอร์ดชั้น ICU</option>
                </BsForm.Control>
              </div>
            </div>{/* /.form-group */}
          </Col>
        </Row>

        <table className="table table-bordered table-striped table-sm" style={{ fontSize: '14px'}}>
          <thead>
            <tr>
              <th style={{ width: '3%', textAlign: 'center' }}>#</th>
              <th style={{ width: '8%', textAlign: 'center' }}>CID</th>
              <th>ชื่อ-สกุล</th>
              <th style={{ width: '8%', textAlign: 'center' }}>วันที่เกิด</th>
              <th style={{ width: '6%', textAlign: 'center' }}>อายุ (ปี)</th>
              <th style={{ width: '20%' }}>ตำแหน่ง</th>
              <th style={{ width: '25%' }}>สังกัด</th>
              <th style={{ width: '6%', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons && persons.map((person, index) => (
              <tr key={person.person_id}>
                <td style={{ textAlign: 'center' }}>{pager?.from + index}</td>
                <td style={{ textAlign: 'center' }}>{person.person_id}</td>
                <td>{`${person.prefix.prefix_name}${person.person_firstname} ${person.person_lastname}`}</td>
                <td style={{ textAlign: 'center' }}>
                  {moment(person.person_birth).format('DD/MM/YYYY')}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {calcAge(person.person_birth)}
                </td>
                <td>{person.position.position_name}</td>
                <td>{person.member_of.depart?.depart_name}</td>
                <td style={{ textAlign: 'center' }}>
                  <Button
                    size="xs"
                    onClick={() => {
                      onSelected(person);
                      hideModal();
                    }}
                  >
                    เลือก
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Row>
          <Col className="my-auto">
            <span>หน้า {pager?.current_page} / {pager?.last_page} - จำนวนทั้งหมด {pager?.total} ราย</span>
          </Col>
          <Col>
            <Pagination className="float-right mb-0">
              <Pagination.First
                onClick={() => handlePaginationClick(pager?.first_page_url)}
                disabled={pager?.current_page === 1}
              />
              <Pagination.Prev
                onClick={() => handlePaginationClick(pager?.prev_page_url)}
                disabled={pager?.current_page === 1}
              />
              <Pagination.Next
                onClick={() => handlePaginationClick(pager?.next_page_url)}
                disabled={pager?.current_page === pager?.last_page}
              />
              <Pagination.Last
                onClick={() => handlePaginationClick(pager?.last_page_url)}
                disabled={pager?.current_page === pager?.last_page}
              />
            </Pagination>
          </Col>
        </Row>

      </Modal.Body>
    </Modal>
  );
}

PersonModal.propTypes = {
  isOpen: PropTypes.bool,
  hideModal: PropTypes.func,
  onSelected: PropTypes.func,
};

export default PersonModal;
