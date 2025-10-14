"use client";
import Options from "@/components/ui/Options";
import Display from "@/components/ui/Display";
import Overlay from "@/components/ui/Overlay";
import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { HelpOutlineRounded, MailOutlineRounded } from "@mui/icons-material";
import TreeCard from "@/components/student/treeSCard";
import SCard from "@/components/ui/SCard";
import {
  Student as StudentType,
  Query as QueryType,
  Options as OptType,
  Student,
} from "@/lib/types/data";
import GuestFooter from "@/components/student/Treefooter";

// TODO: Understand the logic of IFrame, may be we need to remove it, so no once embed in the site
const isIFrame = typeof window !== "undefined" && window.top === window.self;

export default function Home(props: Object) {
  const workerRef = useRef<Worker>(); // [For: Worker Object] [Use a ref to hold the worker instance so it persists across re-renders]
  const [students, setStudents]: [Array<StudentType>, Function] = useState([]);
  const [currDisp, setCurr]: [any, Function] = useState();
  const [loading, setLoading] = useState(true); //loading at the start
  const [listOpts, setOpts]: [OptType, Function] = useState({
    batch: ["Loading..."],
    hall: ["Loading..."],
    course: ["Loading..."],
    dept: ["Loading..."],
  });
  const [iFrame, setIFrame] = useState(false);
  const searchBar = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // To ensure it runs in the browser only
    if (typeof window !== "undefined" && window.Worker) {
      console.log("[Component Mounted] - Worker Initializing");

      // Create worker instance. The URL is relative to public folder
      const worker = new Worker("workers/data_worker.js", {
        type: "module",
      });
      workerRef.current = worker;

      // Listen for messages
      worker.onmessage = (event: MessageEvent) => {
        const { status, options, results, message } = event.data;
        console.log("Message received from worker:", event.data); // Debug

        // Cases
        switch (status) {
          case "ready":
            setLoading(false);
            console.log(options)
            setOpts(options);
            console.log("Worker Ready");
            break;
          case "query_results":
            queryHandler(results);
            break;
          case "family_tree_results":
            treeHandler(results);
          case "error":
            errorHandler();
            console.log(message);
        }
      };

      // Unexpected error
      worker.onerror = (error) => {
        console.error("Error occurred: ", error);
        errorHandler()
      };

      // Initial command to start
      worker.postMessage({ command: "initialize" });

      // Cleanup function
      return () => {
        console.log("[Component UnMounted] - Terminating Worker");
        workerRef.current?.terminate();
      };
    }
  }, []);

  function queryHandler(results: any) {
    setStudents(
      results.toSorted((a: StudentType, b: StudentType) => {
        try {
          return Number(a.rollNo) > Number(b.rollNo);
        } catch (err) {
          return a.rollNo > b.rollNo;
        }
      })
    );
  }

  function treeHandler(family_tree_results: any) {
    // document.body.style.overflow = "hidden"; //hotfix
    let [baapu, student, bacchas] = family_tree_results;
    setCurr([
      <TreeCard
        key="open"
        data={student}
        baapu={baapu /*TreeCard'll handle undefined*/}
        bacchas={bacchas}
        displayCard={displayCard}
        clearOverlay={clearOverlay}
      />,
      <div className="footer-absolute" key="footer">
        <GuestFooter />
      </div>,
    ]);
  }

  function errorHandler() {
    displayElement(
      <Card>
        <h1>Data could not be retrieved locally nor fetched.</h1>
        <h2>
          Please access the website from campus or via VPN once so that student
          data can be downloaded and stored.
        </h2>
        <p>Check the console for more details.</p>
      </Card>
    );
  }

  useEffect(() => {
    setIFrame(!isIFrame);
  }, []);
  //on mount: load the iframe stopper, need to do it this way so that static generation generates the page normally (isIFrame is false when building because typeof window is "undefined" then) but if the page is indeed an iframe, the app stops working
  //can't stop iframes the normal way (setting HTTP header to disallow them) because github pages doesn't allow you to set HTTP headers :(

  // TODO: Better way to do this set up
  const keydownfxn = (e: any) => {
    if (
      e.key === "/" &&
      searchBar.current &&
      document.activeElement != searchBar.current
    ) {
      e.preventDefault();
      searchBar.current.focus();
    } else if (
      e.key === "Escape" &&
      document.activeElement &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownfxn);
    return () => {
      document.removeEventListener("keydown", keydownfxn);
    };
  }, []);
  //on mount: add / button detection to move focus to search bar

  const sendQuery = (query: QueryType) => {
    workerRef.current?.postMessage({ command: "query", payload: query });
  };

  const clearOverlay = () => {
    setCurr(undefined);
    // 		document.body.style.overflow = "auto"; //hotfix
  };

  const displayElement = (element: any) => {
    clearOverlay();
    setCurr([element]);
    // 		document.body.style.overflow = "hidden"; //hotfix
  };

  const displayCard = (student: StudentType) => {
    clearOverlay();
    // document.body.style.overflow = "hidden"; //hotfix
    setCurr([
      <SCard compact={false} data={student} key="closed">
        <Button
          onClick={() => {
            displayTree(student);
          }}
        >
          Open Family Tree
        </Button>
      </SCard>,
    ]);
  };

  const displayTree = (student: StudentType) => {
    clearOverlay();
    // if (!workerReady) return;
    workerRef.current?.postMessage({
      command: "get_family_tree",
      payload: student,
    });
  };

  //  TODO: Solve the logic of iframe
  if (!iFrame)
    return (
      <div>
        {/* <ThemeProvider
          theme={
            darkMode
              ? createTheme({
                  palette: {
                    mode: "dark",
                  },
                })
              : createTheme({})
          }
        > */}
        <div
          className="buttons"
          style={{
            zIndex: "9999",
          }}
        >
          <Fab
            onClick={() => {
              displayElement(
                <Card
                  style={{
                    padding: "10px",
                  }}
                >
                  <h1>Setting a custom DP</h1>
                  <p>
                    You can customise the image shown here by placing a custom
                    image in your iitk webhome folder called dp.jpg/dp.png such
                    that going to http://home.iitk.ac.in/~yourusername/dp opens
                    up that particular picture.
                  </p>
                  <h1>How do I update the data shown here?</h1>
                  <p>{`The data here is scraped from the Office Automation Portal. The data there can be updated via the Login Based Services > Student Profile > PI form . If you have had a branch change, please go to the ID Cell and update your ID Card to update your branch.`}</p>
                  <p>The changes if any will be reflected in about a week. </p>
                  <h1>{`I can't see students' pictures/I can't access student data.`}</h1>
                  <p>{`Access to student data is restricted to those currently on campus or connecting via VPN. Please visit the website once via either method so that the data can be stored locally. After this, you will be able to access student data from anywhere (as long as you don't wipe your cache or local files).`}</p>
                  <h1>Credits</h1>
                  <p>
                    Student Search has gone through many iterations over the
                    years. The current one was made by Deven Gangwani and
                    Krishnansh Agrawal (both Y21).The one just before this was
                    made by Yash Srivastav (Y15).
                  </p>
                  <p>
                    Credit for Student Guide data (bacche, ammas and baapus)
                    goes to the Counselling Service, IITK.
                  </p>
                </Card>
              );
            }}
          >
            <HelpOutlineRounded />
          </Fab>
          <Fab
            style={{
              display:
                students.length < 3000 && students.length > 0 ? "" : "none",
            }}
            onClick={() => {
              displayElement(
                <Card
                  style={{
                    padding: "10px",
                    width: "80vw",
                    maxWidth: "1200px",
                    maxHeight: "1000px",
                  }}
                >
                  <p>{`Press the 'copy' button to copy all email addresses.`}</p>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                    }}
                  >
                    {students
                      .filter((el) => el.email.length > 0)
                      .map((el) => el.email)
                      .join(", ")}
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        students
                          .filter((el) => el.email.length > 0)
                          .map((el) => el.email)
                          .join(", ")
                      );
                    }}
                  >
                    Copy
                  </Button>
                </Card>
              );
            }}
          >
            <MailOutlineRounded />
          </Fab>
        </div>
        <Options
          sendQuery={sendQuery}
          listOpts={listOpts}
          loading={loading}
          ref={searchBar}
        />
        <br />
        <Display
          loading={loading}
          toShow={students}
          displayCard={displayCard}
        />
        <Overlay clearOverlay={clearOverlay}>
          {currDisp !== undefined ? currDisp : ""}
        </Overlay>
        {/* </ThemeProvider> */}
      </div>
    );
  else
    return (
      <div
        style={{
          width: "60%",
          margin: "auto",
          color: "white",
        }}
      >
        <h1>
          Please view this page at{" "}
          <a href="https://search.pclub.in" target="_blank">
            search.pclub.in
          </a>
        </h1>
        <p>Credits:</p>
        <p>Deven Gangwani</p>
        <p>Krishnansh Agarwal</p>
        <p>Programming Club, IITK</p>
      </div>
    );
}
