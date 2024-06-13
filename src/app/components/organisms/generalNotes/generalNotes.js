"use client";
import styles from "./generalNotes.module.css";
import React, { useCallback, useState, useEffect } from "react";
import Tooltip from "app/components/atoms/tooltip/tooltip";
import { mapNoteCategoryToKey } from "app/utils/utils";
import moment from "moment";
import GeneralNoteCategoryFilter from "./generalNoteCategoryFilter";
import GeneralNoteViewModal from "./generalNoteViewModal";

import ConfirmationModal from "app/components/atoms/confirmationModal/confirmationModal";
import { Button } from "antd";
import LockButton from "app/components/atoms/lockButton/lockButton";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useAuthData } from "context/authContext";
import DateTimeItem from "app/components/atoms/workorderComponents/dateTimeItem";
import UserLabel from "../users/userLabel";
import { convertToLocaleDateTimelll } from "app/utils/date";
import { useSelector } from "react-redux";

export default function GeneralNotes(props) {
  const {
    moduleId,
    mode = "expanded",
    notes,
    noteCategories,
    handleNoteSave,
    handleNoteDelete,
    readOnly = false,
    canAdd = false,
    canEdit = false,
    canDelete = false,
  } = props;

  const { loggedInUser } = useAuthData();

  const [noteToEdit, setNoteToEdit] = useState({});
  const [selectedNoteCategory, setSelectedNoteCategory] = useState("All");
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showDeleteNote, setShowDeleteNote] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [tempNotes, setTempNotes] = useState([]);
  const [originalNotes, setOriginalNotes] = useState([]);

  let categories = Object.entries(noteCategories).map((e) => {
    return { key: e[0], value: e[1].label, color: e[1].color, icon: e[1].icon };
  });

  const { isMobile } = useSelector((state) => state.app);

  const showAddNote =
    tempNotes.filter((x) => x.id === 0).length === 0 && canAdd;

  const isEditing = tempNotes.filter((x) => x.isEditing === true).length > 0;

  const filteredNotes =
    selectedNoteCategory === "All"
      ? tempNotes
      : tempNotes.filter(
          (i) => mapNoteCategoryToKey(i.category) === selectedNoteCategory
        );

  useEffect(() => {
    if (notes) {
      const _originalNotes = JSON.parse(JSON.stringify(notes));
      setOriginalNotes(_originalNotes);

      const _t = JSON.parse(JSON.stringify(notes));

      _t.forEach((t) => {
        t["isEditing"] = false;
      });

      setTempNotes(_t);
    }
  }, [notes]);

  const handleUpdateNote = useCallback(
    (noteId, column, value, type = null) => {
      setTempNotes((prevNotes) => {
        let _p = JSON.parse(JSON.stringify(prevNotes));
        let _n = _p.find((n) => n.id === noteId);

        if (column === "isEditing") {
          if (value === true) {
            // Set isEditing to false for all other notes in the same column
            _p.forEach((note) => {
              if (note.id !== noteId && note[column] === true) {
                let _og = originalNotes.find((n) => n.id === note.id);
                if (_og) {
                  Object.assign(note, _og);
                  note.isEditing = false;
                }
              }
            });
            _n.isEditing = true;
          } else {
            if (_n && _n.id === "") {
              if (selectedNoteCategory !== "All") {
                if (
                  _p.filter(
                    (note) =>
                      note.id !== _n.id &&
                      note.category ===
                        categories.find((x) => x.key === selectedNoteCategory)
                          .value
                  ).length > 0
                ) {
                } else {
                  setSelectedNoteCategory("All");
                }
              }
              return _p.filter((note) => note.id !== noteId);
            } else {
              // Handle the case when isEditing is set to false
              let _og = originalNotes.find((n) => n.id === noteId);
              if (_og) {
                Object.assign(_n, _og);
                _n.isEditing = false;
              }

              if (selectedNoteCategory !== "All")
                setSelectedNoteCategory(mapNoteCategoryToKey(_og.category));
            }
          }
        } else {
          if (column === "notesDate") {
            let newDate = moment(_n[column]);

            switch (type) {
              case "date":
                const newDateValue = moment(value);
                newDate.set({
                  year: newDateValue.year(),
                  month: newDateValue.month(),
                  date: newDateValue.date(),
                });
                break;
              case "time":
                const newTime = moment(value, "HH:mm");
                newDate.set({
                  hour: newTime.hour(),
                  minute: newTime.minute(),
                  second: newTime.second(),
                });
                break;
            }

            _n[column] = newDate.toISOString();
          } else _n[column] = value;
        }

        return _p;
      });
    },
    [categories, originalNotes, selectedNoteCategory]
  );

  const onDeleteNoteClick = (id) => {
    if (id) {
      setNoteIdToDelete(id);
      setShowDeleteNote(true);
    }
  };

  const onDeleteConfirm = useCallback(async () => {
    if (noteIdToDelete) {
      setShowDeleteNote(false);
      await handleNoteDelete(noteIdToDelete);
      setNoteIdToDelete(null);
    }
  }, [noteIdToDelete, handleNoteDelete]);

  const onDeleteCancel = useCallback(async () => {
    setShowDeleteNote(false);
    setNoteIdToDelete(null);
  }, []);

  const onEditClick = useCallback(
    (id) => {
      handleUpdateNote(id, "isEditing", true);
    },
    [handleUpdateNote]
  );

  const onCancelClick = useCallback(
    (id) => {
      handleUpdateNote(id, "isEditing", false);
    },
    [handleUpdateNote]
  );

  const onCatSelect = useCallback(
    (id, val) => {
      handleUpdateNote(id, "category", val);

      if (selectedNoteCategory !== "All")
        setSelectedNoteCategory(mapNoteCategoryToKey(val));
    },
    [handleUpdateNote, selectedNoteCategory]
  );

  const onDtChange = useCallback(
    (e, type, id) => {
      handleUpdateNote(id, "notesDate", e.target.value, type);
    },
    [handleUpdateNote]
  );

  const onNoteTxtChange = useCallback(
    (id, val) => {
      handleUpdateNote(id, "notes", val);
    },
    [handleUpdateNote]
  );

  const handleSelectCategoryFilter = useCallback((catKey = "All") => {
    setSelectedNoteCategory(catKey);
  }, []);

  const handleEditModalOpen = useCallback((note) => {
    setNoteToEdit(note);
    setShowEditNoteModal(true);
  }, []);

  const handleEditModalClose = () => {
    setShowEditNoteModal(false);
  };

  const handleSaveNote = (e, note) => {
    handleNoteSave(note);
  };

  const onAddNoteClick = useCallback(() => {
    setTempNotes((prevNotes) => {
      let _p = JSON.parse(JSON.stringify(prevNotes));
      _p.forEach((note) => {
        let _og = originalNotes.find((n) => n.id === note.id);
        if (_og) {
          Object.assign(note, _og);
          note.isEditing = false;
        }
      });

      let _nN = {
        id: "",
        parentId: moduleId,
        notes: "",
        notesDate: new Date().toISOString(),
        category:
          selectedNoteCategory === "All"
            ? categories[0].value
            : categories.find((x) => x.key === selectedNoteCategory).value,
        calledBy: loggedInUser ? loggedInUser.name : "Test User",
        isEditing: true,
      };

      _p.unshift(_nN);
      return _p;
    });
  }, [originalNotes, selectedNoteCategory, categories, loggedInUser, moduleId]);

  const NewNoteButton = () => {
    return (
      <>
        {showAddNote && (
          <Tooltip title="Create new note">
            <div
              className=" text-centraBlue hover:text-blue-400 cursor-pointer flex justify-end items-center space-x-2"
              onClick={onAddNoteClick}
            >
              <i className="fa-solid fa-note-sticky"></i>
              <span className="text-xs hover:underline">Add Note</span>
            </div>
          </Tooltip>
        )}
      </>
    );
  };

  const NoteContent = (note) => {
    return (
      <div
        className={`flex flex-col justify-between pb-1 ${
          isMobile ? "w-full" : "w-2/3"
        }`}
      >
        {note.isEditing ? (
          <div className="flex pb-2 justify-between items-center">
            <div>
              <Tooltip title="Choose Note Category">
                <DropdownButton
                  id="dropdown-basic-button"
                  size="sm"
                  title={
                    <span>
                      <i
                        className={`${
                          note.category
                            ? categories.find(
                                (option) =>
                                  option.key ===
                                  mapNoteCategoryToKey(note.category)
                              ).icon
                            : categories[0].icon
                        } text-white text-xs`}
                      ></i>
                      <span className="text-sm">
                        {note.category
                          ? categories.find(
                              (option) =>
                                option.key ===
                                mapNoteCategoryToKey(note.category)
                            ).value
                          : categories[0].value}
                      </span>
                    </span>
                  }
                >
                  {categories.map((c, index) => {
                    return (
                      <Dropdown.Item
                        onClick={() => onCatSelect(note.id, c.value)}
                        key={`noteCategoryOptions-${index}`}
                      >
                        <span className="text-sm">
                          <i className={c.icon}></i>
                          {c.value}
                        </span>
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="flex pb-1 justify-between items-center">
            <div className="flex items-center">
              <i
                className={
                  categories.find(
                    (c) => c.key === mapNoteCategoryToKey(note.category)
                  ).icon
                }
              ></i>
              <div className="text-xs">
                {
                  categories.find(
                    (c) => c.key === mapNoteCategoryToKey(note.category)
                  ).value
                }
              </div>
            </div>

            <div className="flex space-x-2 ">
              <Tooltip title="Expand Note">
                <i
                  className="fa-solid fa-expand cursor-pointer opacity-20 hover:opacity-100"
                  onClick={() => handleEditModalOpen(note)}
                />
              </Tooltip>

              {canEdit && (
                <Tooltip title="Edit Note">
                  <i
                    className="fa-solid fa-pen cursor-pointer opacity-20 hover:opacity-100"
                    onClick={() => onEditClick(note.id)}
                  />
                </Tooltip>
              )}
              {canDelete && (
                <Tooltip title="Delete Note">
                  <i
                    className="fa-solid fa-trash cursor-pointer opacity-20 hover:opacity-100"
                    onClick={() => onDeleteNoteClick(note.id)}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        )}

        <textarea
          id={`noteTextArea_${note.id}`}
          className={`${styles.textArea}`}
          disabled={!note.isEditing}
          onChange={(e) => onNoteTxtChange(note.id, e.target.value)}
          rows={3}
          value={note.notes}
        />

        {note.isEditing && (
          <div className="flex space-x-2 justify-end mt-2">
            <Button onClick={() => onCancelClick(note.id)} size="small">
              Cancel
            </Button>
            <LockButton
              tooltip={"Save Note"}
              onClick={() => handleNoteSave(note)}
              disabled={false}
              showLockIcon={false}
              label={"Save"}
              size="small"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mode === "expanded" ? (
        <>
          {filteredNotes?.length > 0 && (
            <div
              className={`p-2 z-10 flex flex-row items-center justify-center sticky bg-white ${styles.notesHeader}`}
              style={{ borderBottom: "0.5px solid lightgray" }}
            >
              <div
                className={`flex items-center justify-between w-full space-x-4`}
              >
                <div
                  className={`flex flex-row items-start space-x-2 ${
                    isMobile ? "mt-1" : ""
                  }`}
                >
                  {tempNotes.length > 0 && (
                    <GeneralNoteCategoryFilter
                      notes={tempNotes}
                      noteCategories={noteCategories}
                      selectedCategory={selectedNoteCategory}
                      handleSelectCategoryFilter={handleSelectCategoryFilter}
                      disabled={isEditing}
                    ></GeneralNoteCategoryFilter>
                  )}
                </div>
                {!readOnly && NewNoteButton()}
              </div>
            </div>
          )}
          {filteredNotes?.length > 0 ? (
            <table className="table mb-0">
              <tbody>
                {filteredNotes.map((note, index) => {
                  return (
                    <tr key={`note-${note.id}`}>
                      <td>
                        <div
                          className={`w-full flex ${
                            isMobile ? "flex-col" : "space-x-2"
                          }`}
                        >
                          {note.isEditing ? (
                            <div
                              className={`flex items-start space-x-4 ${
                                isMobile ? "w-full justify-start mb-2" : "w-1/3"
                              }`}
                            >
                              <DateTimeItem
                                id={note.id}
                                name={"notesDate"}
                                value={note.notesDate}
                                onChange={onDtChange}
                                showLabel={false}
                                style={{ color: "var(--centrablue)" }}
                              />
                            </div>
                          ) : (
                            <div
                              className={`flex space-y-1 text-xs ${
                                isMobile
                                  ? "w-full justify-between mb-2"
                                  : "w-1/3 flex-col pl-2 mt-1"
                              }`}
                            >
                              <div className="flex space-x-1">
                                <UserLabel username={note.calledBy} />
                              </div>
                              <div className="text-gray-400">
                                {convertToLocaleDateTimelll(note.notesDate)}
                              </div>
                            </div>
                          )}
                          {NoteContent(note)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div
              className={`flex ${
                isMobile ? "justify-center h-full" : "justify-between"
              }  items-center`}
            >
              {!isMobile && (
                <div className="pl-6 py-4 text-gray-400 text-xs">
                  No notes have been added for this order.
                </div>
              )}
              <div className="pr-4">{NewNoteButton()}</div>
            </div>
          )}

          <GeneralNoteViewModal
            parentId={moduleId}
            show={showEditNoteModal}
            onClose={handleEditModalClose}
            noteCategoryOptions={categories}
            note={noteToEdit}
            onSave={handleSaveNote}
          />
        </>
      ) : (
        <div className="pl-2 w-full">
          {notes?.map((note) => {
            return (
              <div key={note.id} className="flex p-1 items-center space-x-2">
                <i
                  className={
                    categories.find(
                      (c) => c.key === mapNoteCategoryToKey(note.category)
                    ).icon
                  }
                ></i>
                <div className="truncate">{note.notes}</div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        title={`Delete Note`}
        open={showDeleteNote}
        onOk={onDeleteConfirm}
        onCancel={onDeleteCancel}
        cancelLabel={"No"}
        okLabel={"Yes"}
      >
        <div className="pt-2">
          <div>Are you sure you want to delete this note?</div>
        </div>
      </ConfirmationModal>
    </>
  );
}
