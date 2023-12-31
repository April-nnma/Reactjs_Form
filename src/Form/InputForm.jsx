import React from "react";
import { connect } from "react-redux";

const InputField = ({ student, errors, disabled, students, dispatch }) => {
  const handleInput = (e) => {
    const { id, value } = e.target;
    let message = "";
    let dataType = e.target.getAttribute("data-type");

    switch (dataType) {
      case "letter": {
        let regexLetter =
          /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
        if (!regexLetter.test(value.trim())) {
          message = " phải dạng ký tự";
        }
        break;
      }
      case "number": {
        let min = JSON.parse(e.target.getAttribute("min-maxLength"))[0];
        let max = JSON.parse(e.target.getAttribute("min-maxLength"))[1];
        if (value.length < min || value.length > max) {
          message = ` phải dài từ ${min} số đến ${max} số`;
        }
        break;
      }
      case "id": {
        let regexNumber = /^[0-9]+$/;
        if (!regexNumber.test(value)) {
          message = " phải là số";
        }
        break;
      }
      case "email": {
        var mailformat =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\ [[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!mailformat.test(value)) {
          message = " chưa đúng dạng Email";
        }
        break;
      }
    }

    if (value.trim() === "") {
      message = " không được bỏ trống";
    }

    if (id === "key") {
      let duplicateKey = students.find(
        (student) => student.key === e.target.value
      );
      if (duplicateKey) {
        message = id + " đã tồn tại";
        const action = {
          type: "HANLDE_KEY",
          payload: { message, id },
        };
        dispatch(action);
      }
    }

    const action = {
      type: "HANDLE_CHANGE",
      payload: {
        id: id,
        value: value,
      },
    };

    const actionError = {
      type: "HANDLE_ERROR",
      payload: { message, id },
    };

    dispatch(action);
    dispatch(actionError);
  };

  const checkValidForm = () => {
    const errorsCopy = { ...errors };
    let output = false;

    for (let key in errorsCopy) {
      if (errorsCopy[key] !== "") {
        output = true;
        break;
      }
    }

    return output;
  };

  const handleSubmit = () => {
    if (checkValidForm()) {
      return;
    }

    const values = { ...student };
    const action = {
      type: "HANDLE_SUBMIT",
      payload: values,
    };

    dispatch(action);

    const reset = {
      type: "HANDLE_RESET",
      payload: null,
    };

    dispatch(reset);
  };

  const handleUpdate = () => {
    if (checkValidForm()) {
      return;
    }

    const studentCopy = { ...student };
    const action = {
      type: "HANDLE_UPDATE",
      payload: studentCopy,
    };

    dispatch(action);

    const disabled = {
      type: "HANDLE_iSDISABLEd",
      payload: null,
    };

    dispatch(disabled);
  };

  return (
    <div className="container mb-5">
      <form className="card">
        <div className="card-header bg-dark">
          <h3 className="text-white">Quản lý sinh viên</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-6">
              <p className="d-inline-block">Mã SV</p>{" "}
              <span className="text-danger">{errors.key}</span>
              <input
                type="id"
                id="key"
                uniqe="id"
                min-maxLength="[3,5]"
                data-type="id"
                className="form-control"
                onChange={handleInput}
                value={student.key}
                disabled={!disabled}
              />
            </div>
            <div className="col-6">
              <p className="d-inline-block">Họ Tên</p>{" "}
              <span className="text-danger">{errors.name}</span>
              <input
                type="text"
                id="name"
                data-type="letter"
                className="form-control"
                onChange={handleInput}
                value={student.name}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p className="d-inline-block">Số Điện Thoại</p>{" "}
              <span className="text-danger">{errors.phoneNumber}</span>
              <input
                type="number"
                id="phoneNumber"
                className="form-control"
                min-maxLength="[8,10]"
                data-type="number"
                onChange={handleInput}
                value={student.phoneNumber}
              />
            </div>
            <div className="col-6">
              <p className="d-inline-block">Email</p>{" "}
              <span className="text-danger">{errors.email}</span>
              <input
                type="email"
                id="email"
                className="form-control"
                onChange={handleInput}
                data-type="email"
                value={student.email}
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={!disabled}
          >
            Thêm
          </button>
          <button
            type="button"
            className="btn btn-primary mx-2"
            onClick={handleUpdate}
            disabled={disabled}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  students: state.students,
  student: state.student,
  errors: state.errors,
  disabled: state.disabled,
});

export default connect(mapStateToProps)(InputField);
