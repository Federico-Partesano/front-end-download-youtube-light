import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Skeleton,
  Stack,
  useToast,
  Progress,
} from "@chakra-ui/react";
import axios from "axios";
import React, { FC, useEffect, useRef, useState } from "react";
import { socketConnection } from "../../App";
import Card from "../../components/Card/Card";
import { basicApi } from "../../enviroument";
import debounce from "lodash.debounce";
import "./Home.scss";
const downloadjs = require('downloadjs');

interface IHome {}
let selectedVideoId: null | string = null;

const debouncedFetchVideo = debounce(async (term: string, loadVideo: (term: string) => void) => {
  loadVideo(term);
}, 200 )


let closeToast:   null | (() => void) = null;
const Home: FC<IHome> = () => {
  const selectedTrack = useRef("audio.mp3");
  const [data, setData] = useState<any[]>();
  const toast = useToast();
  const [term, setTerm] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [canDownload, setCanDownload] = useState(false);
  const loadVideo = async (termVideo: string) => {
    if (termVideo.length < 3) return;
    setIsSearchLoading(true);
    const { data } = await axios.get(
      `${basicApi}/youtube/songs?term=${termVideo}`
    );
    setData(data);
    setIsSearchLoading(false);
  };
  const chekcStatus = async () => {
    const {
      data: { status },
    } = await axios.get<{ status: "downloading" | "await" }>(
      `${basicApi}/youtube/status`
    );
    setCanDownload(status === "downloading" ? true : false);
  };
  useEffect(() => {
      socketConnection?.on("status", ({ status, videoId }) => {
        setCanDownload(status === "downloading" ? true : false);
        if(videoId !== selectedVideoId) return;
        if(status === "await"){
         closeToast && closeToast();
         var x=new XMLHttpRequest();
         x.open( "GET", `${basicApi}/youtube/downloaded-song` , true);
         x.responseType="blob";
         x.onload= function(e){downloadjs((e!.target! as any).response, selectedTrack.current, "audio/mp3");
         selectedTrack.current = "audio.mp3";
         selectedVideoId = null;
        };
         x.send();
        }
     
    });
  // eslint-disable-next-line
  }, [socketConnection]);

  useEffect(() => {
    chekcStatus();
  }, [])
  

  useEffect(() => {
    debouncedFetchVideo(term, loadVideo);
  }, [term])
  

  const handleDownload = async(videoId: string, title: string) => {
    selectedTrack.current = `${title}.mp3`;
    selectedVideoId = videoId;
    setCanDownload(true);
    const {data} = await axios.get(`${basicApi}/youtube/song?videoId=${videoId}`);
    if(data.status === "await") {
      toast({
        position: "bottom",
        duration: 2000,
        title: "Aspetta",
        description: "Gìà c'è un download in corso, attendere..."
      });
    }
    console.log('data', data)
    toast({
      position: "bottom",
      duration: null,
      render: ({onClose}) => {
        closeToast = onClose;
        return <Box color="white" p={3} bg="blue.500">
          <Progress size="xs" isIndeterminate />
          <Text textAlign={"center"}>downloading...</Text>
        </Box>
      },
    });
  };
  return (
    <div>
      <Container maxW="container.md">
        <Box textAlign="center" fontSize="xl">
          <Box mt="5" mb="5">
            <Heading className="special-elite-font" size="2xl">
              YouTube Downloader
            </Heading>
            <Text>Ciao Mario per scaricare una canzone inserisci il suo nome nel campo sottostante, cercherà la canzone direttamente da youtube, clicca su download, attendi e se tutto andrà a buon fine in automatico ti inserirà nella cartella dowload la canzone scelta.</Text>
          </Box>
          <Input
            onChange={({ currentTarget: { value } }: any) => {
              setTerm(value);
            }}
            placeholder="Barra di ricerca"
          />
          <div className="mt-4">
            {data &&
              data.map((item) => {
                return (
                  <div key={item.id.videoId}>
                    <Card
                      handleDownload={handleDownload}
                      downloadDisabled={canDownload}
                      key={item.id.videoId}
                      video={item}
                    />
                  </div>
                );
              })}

            {isSearchLoading && (
              <>
                <Stack>
                  {Array.from({ length: 6 }, (_, i) => i).map((i) => (
                    <Skeleton key={i} borderRadius={"10px"} height="500px" />
                  ))}
                </Stack>
              </>
            )}
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
