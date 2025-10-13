import React from "react";
import SCard from "@/components/ui/SCard";
import Card from "@mui/material/Card";
import { Student } from "@/lib/types/data";

interface TreeCardProps {
  baapu?: Student;
  bacchas: Array<Student>;
  data: Student;
  displayCard: Function;
  clearOverlay?: Function;
}

function TreeCard(props: TreeCardProps) {
  return (
    <div className="tree-view">
      {props.baapu != undefined ? (
        <SCard
          pointer={true}
          compact={"ultra"}
          data={props.baapu}
          onClick={() => {
            //smoothly scroll to top
            document.getElementsByClassName("MuiModal-root")[0].scrollTo(0, 0);
            props.displayCard(props.baapu);
          }}
        />
      ) : (
        <Card>Not Available :(</Card>
      )}
      <SCard
        pointer={true}
        compact={true}
        data={props.data}
        onClick={() => {
          props.displayCard(props.data);
        }}
      />
      <div className="bacchas">
        {props.bacchas.length > 0
          ? props.bacchas.map((el) => (
              <SCard
                pointer={true}
                compact={"ultra"}
                data={el}
                key={el.rollNo}
                onClick={(e) => {
                  //smoothly scroll to top
                  document
                    .getElementsByClassName("MuiModal-root")[0]
                    .scrollTo(0, 0);
                  //   let start = null;
                  //   let scroll = window;
                  //   window.requestAnimationFrame(function step(currentTime) {
                  //     if (!start) start = currentTime;
                  //   });
                  //   // actually show the card
                  props.displayCard(el);
                }}
              />
            ))
          : ""}
      </div>
    </div>
  );
}

export default TreeCard;
