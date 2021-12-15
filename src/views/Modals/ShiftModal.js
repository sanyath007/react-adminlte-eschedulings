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

function ShiftModal({ isOpen, hideModal, onSelected, ...props }) {
  const [persons, setPersons] = useState([]);
  const [pager, setPager] = useState(null);

  const fetchPersons = async (fname='', faction='', depart='', division='') => {
    faction = props.faction ? props.faction : '5';
    depart = props.depart ? props.depart : '';
    division = props.division ? props.division : '';

    let res = await api.get(`/api/persons?fname=${fname}&faction=${faction}&depart=${depart}&division=${division}`);

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
  }, [props.faction, props.depart]);

  return (
    <Modal
      show={isOpen}
      onHide={hideModal}
      size="xl"
      style={{ top: '50px', zIndex: '1500' }}
    >
      <Modal.Header closeButton>รายละเอียดเวร</Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div className="form-group col-md-6 pl-0">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">คันหาชื่อ</span>
                </div>
                <BsForm.Control
                  onChange={(e) => fetchPersons(e.target.value)}
                ></BsForm.Control>
              </div>
            </div>{/* /.form-group */}
          </Col>
        </Row>

        <Row>
          
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
