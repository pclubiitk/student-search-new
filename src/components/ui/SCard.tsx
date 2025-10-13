import React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Image from "@/components/UserImage";
import { Student } from "@/lib/types/data";
import {
  EmailRounded,
  InvertColorsRounded,
  HomeRounded,
  AccountBalanceRounded,
  Public,
  PeopleOutlineRounded,
} from "@mui/icons-material";
//import "styles/SCard.css";

//props: data: object with student data

interface SCardProps {
  data: Student;
  pointer?: boolean;
  compact: boolean | "ultra";
  onClick?: (event: any) => void;
  children?: any | any[];
}

const SCard = React.forwardRef((props: SCardProps, ref: any) => {
  switch (props.compact) {
    case "ultra":
      return (
        <Card
          className="student-card-ultra-compact"
          key={props.data.rollNo}
          ref={ref}
          style={{
            cursor: props.pointer ? "pointer" : "auto",
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (props.onClick !== undefined) props.onClick(event);
          }}
        >
          <Image
            style={{ width: 100, height: 100 }}
            email={props.data.email}
            rollNo={props.data.rollNo}
            gender={props.data.gender}
            alt="Image of student"
          />
          <div className="data">
            <p>{props.data.name}</p>
            <p>{props.data.rollNo}</p>
            {Array.isArray(props.data.bachhas) && props.data.bachhas.length > 0 && (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                }}
              >
                <PeopleOutlineRounded />
              </div>
            )}
          </div>
        </Card>
      );
    case true:
      return (
        <Card
          className="student-card-compact"
          key={props.data.rollNo}
          ref={ref}
          style={{
            cursor: props.pointer ? "pointer" : "auto",
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (props.onClick !== undefined) props.onClick(event);
          }}
        >
          <Image
            style={{ width: 150, height: 150 }}
            email={props.data.email}
            rollNo={props.data.rollNo}
            gender={props.data.gender}
            alt="Image of student"
          />
          <div className="data">
            <p>{props.data.name}</p>
            <p>{props.data.dept}</p>
            <p>{props.data.rollNo}</p>
          </div>
        </Card>
      );
    case false:
      return (
        <Card
          className="student-card"
          key={props.data.rollNo}
          ref={ref}
          style={{
            cursor: props.pointer ? "pointer" : "auto",
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (props.onClick !== undefined) props.onClick(event);
          }}
        >
          <Image
            style={{ width: 200, height: 200 }}
            email={props.data.email}
            rollNo={props.data.rollNo}
            gender={props.data.gender}
            alt="Image of student"
          />
          <p className="name">{props.data.name}</p>
          <p className="roll">{props.data.rollNo}</p>
          <p className="dept">
            {props.data.course}, {props.data.dept}
          </p>
          <div className="more-data">
            <div>
              <AccountBalanceRounded />
              <p>
                {props.data.rollNo.length > 0 ? props.data.rollNo + ", " : ""}{" "}
                {props.data.hall}
              </p>
            </div>
            <div>
              <HomeRounded />
              <p>{props.data.homeTown}</p>
            </div>
            {/* <div>
              <InvertColorsRounded />
              <p>{props.data.}</p>
            </div> */}
            {props.data.email.length > 0 ? (
              <div>
                <EmailRounded />
                <p>
                  <a href={`mailto:${props.data.email}`}>{props.data.email}</a>
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* TODO: change it to our home page */}
          <a
            href={`https://home.iitk.ac.in/~${props.data.email}`}
            target="_blank"
          >
            <Button style={{ flexDirection: "column" }}>
              <Public />
              <br />
              <div>Visit Homepage</div>
            </Button>
          </a>
          {props.children}
        </Card>
      );
  }
});

SCard.displayName = "Student Card";

export default SCard;
