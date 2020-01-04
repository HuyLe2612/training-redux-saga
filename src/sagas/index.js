import {
  fork,
  take,
  call,
  put,
  delay,
  takeLatest,
  takeEvery,
  select
} from "redux-saga/effects";
import * as taskTypes from "./../constants/task";
import * as Api from "./../apis/task";
import { STATUS_CODE, STATUSES } from "./../constants";
import {
  fetchListTask,
  fetchListTaskSuccess,
  fetchListTaskFailed,
  addTaskSuccess,
  addTaskFailed,
  updateTaskSuccess,
  updateTaskFailed,
  deleteTaskSuccess,
  deleteTaskFailed
} from "../actions/task";
import { showLoading, hideLoading } from "./../actions/ui";
import { hideModal } from "../actions/modal";
/**
 * B1 : THỰC THI ACTION FETCH TASK
 * B2 : GỌI API
 * B2.1: HIỂN THỊ THANH TIẾN TRÌNH(LOADING)
 * B3 : KIỂM TRA STATUS CODE
 * NẾU THÀNH CÔNG ...
 * NẾU THẤT BẠI ...
 * B4 : TẮC LOADING
 * B5 : THỰC THI CÁC CÔNG VIỆC TIẾP THEO
 */

function* watchFetchListTaskAction() {
  while (true) {
    const action = yield take(taskTypes.FETCH_TASK); // when FETCH_TASK dispatch => The code from here down is implemented
    yield put(showLoading());
    const { params } = action.payload;
    const resp = yield call(Api.getList, params);
    const { status, data } = resp;
    if (status === STATUS_CODE.SUCCESS) {
      yield put(fetchListTaskSuccess(data));
    } else {
      yield put(fetchListTaskFailed(data));
    }
    yield delay(1000);
    yield put(hideLoading());
  }
}

function* filterTaskSaga({ payload }) {
  yield delay(500);
  const { keyword } = payload;
  yield put(
    fetchListTask({
      q: keyword
    })
  );
  // const { keyword } = payload;
  // const list = yield select(state => state.task.listTask);
  // const filteredTask = list.filter(task =>
  //   task.title
  //     .trim()
  //     .toLowerCase()
  //     .includes(keyword.trim().toLowerCase())
  // );
  // yield put(filterTaskSuccess(filteredTask));
}

function* addTaskSaga({ payload }) {
  const { title, description } = payload;
  yield put(showLoading());
  const resp = yield call(Api.addTask, {
    title,
    description,
    status: STATUSES[0].value
  });
  const { data, status } = resp;
  if (status === STATUS_CODE.CREATED) {
    yield put(addTaskSuccess(data));
    yield put(hideModal());
  } else {
    yield put(addTaskFailed(data));
  }
  yield delay(1000);
  yield put(hideLoading());
}


function* updateTaskSaga({ payload }) {
  const { title, description, status } = payload;
  const taskEditing = yield select(state => state.task.taskEditing);
  yield put(showLoading());
  const resp = yield call(
    Api.updateTask,
    {
      title,
      description,
      status
    },
    taskEditing.id
  );
  const { data, status: statusCode } = resp;
  if (statusCode === STATUS_CODE.SUCCESS) {
    yield put(updateTaskSuccess(data));
    yield put(hideModal());
  } else {
    yield put(updateTaskFailed(data));
  }
  yield delay(1000);
  yield put(hideLoading());
}
function* deleteTaskSaga({ payload }) {
  const { id } = payload;
  yield put(showLoading());
  const resp = yield call(Api.deleteTask, id);
  const { data, status: statusCode } = resp;
  if (statusCode === STATUS_CODE.SUCCESS) {
    yield put(deleteTaskSuccess(id));
    yield put(hideModal());
  } else {
    yield put(deleteTaskFailed(data));
  }
  yield delay(1000);
  yield put(hideLoading());
}
function* rootSaga() {
  yield fork(watchFetchListTaskAction);
  yield takeLatest(taskTypes.FILTER_TASK, filterTaskSaga);
  yield takeEvery(taskTypes.ADD_TASK, addTaskSaga);
  yield takeLatest(taskTypes.UPDATE_TASK, updateTaskSaga);
  yield takeLatest(taskTypes.DELETE_TASK, deleteTaskSaga);
}

export default rootSaga;
