import { Collapse, Flex, Spin, Tabs, TabsProps, Tag } from "antd";
import Layout2 from "../Layout2/Layout2";
import styles from "@/styles/LearnCourses.module.scss";
import { FC, ReactNode, useEffect, useState } from "react";
import SvgIcons from "../SvgIcons";
import { useRouter } from "next/router";
import ProgramService from "@/services/ProgramService";
import { ChapterDetail } from "@/types/courses/Course";
import { IResourceDetail } from "@/lib/types/learn";
import { number } from "zod";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  selectedLesson: IResourceDetail | undefined;
  onSelectResource: (resourceId: number) => void;
  setChapterId: (value: number) => void;
  resourceId: number;
  chapterId: number;
  icon: ReactNode;
}> = ({ title, time, onSelectResource, selectedLesson, setChapterId, keyValue, icon, resourceId, chapterId }) => {
  return (
    <div
      style={{ padding: resourceId > 0 ? "5px 0px" : 0, paddingLeft: resourceId > 0 ? "20px" : 0 }}
      className={`${
        selectedLesson && resourceId === selectedLesson.resourceId ? styles.selectedLable : styles.labelContainer
      }`}
      onClick={() => {
        onSelectResource(resourceId);
      }}
    >
      <Flex justify="space-between" align="center">
        <div className={styles.title_container}>
          <Flex gap={10} align="center" onClick={() => setChapterId(chapterId)}>
            {icon}
            <div style={{ cursor: "pointer" }}>{title}</div>
          </Flex>
        </div>
        <div>
          <Tag className={styles.time_tag}>{time}</Tag>
        </div>
      </Flex>
    </div>
  );
};

const LearnCourse: FC<{}> = () => {
  const [courseData, setCourseData] = useState<{
    name: string;
    description: string;
    expiryInDays: number;
    chapters: ChapterDetail[];
  }>({
    name: "",
    description: "",
    expiryInDays: 365,
    chapters: [],
  });

  const [selectedLesson, setSelectedLesson] = useState<IResourceDetail>();
  const [chapterId, setChapterId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLesson, setLessonLoading] = useState<boolean>(false);

  const router = useRouter();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "About",
      children: selectedLesson?.description,
    },
    {
      key: "2",
      label: "Q & A",

      children: "Q And A page",
    },
  ];

  const onSelectResource = (resourceId: number) => {
    setLessonLoading(true);
    setSelectedLesson(
      courseData.chapters
        .find((chapter) => chapter.chapterId === chapterId)
        ?.resource.find((data) => data.resourceId === resourceId)
    );
    setLessonLoading(false);
  };

  const lessonItems = courseData.chapters.map((content, i) => {
    let totalTime = 0;
    content.resource.forEach((data) => {
      totalTime = totalTime + data.videos[0]?.videoDuration;
    });
    return {
      key: `${content.chapterId}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          time={`${totalTime} min`}
          onSelectResource={() => {}}
          resourceId={0}
          chapterId={content.chapterId}
          setChapterId={setChapterId}
          selectedLesson={undefined}
          keyValue={`${content.chapterId}`}
        />
      ),
      children: content.resource.map((res: IResourceDetail, i: any) => {
        return (
          <div className={styles.resContainer}>
            <Label
              title={res.name}
              icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
              time={res.contentType === "Video" ? `${res.videos[0]?.videoDuration} min` : `${res.daysToSubmit} days`}
              onSelectResource={onSelectResource}
              resourceId={res.resourceId}
              setChapterId={() => {}}
              selectedLesson={selectedLesson}
              chapterId={0}
              keyValue={`${i + 1}`}
            />
          </div>
        );
      }),
      showArrow: false,
    };
  });

  useEffect(() => {
    setLoading(true);
    router.query.courseId &&
      ProgramService.getCourses(
        Number(router.query.courseId),
        (result) => {
          setCourseData({
            ...courseData,
            expiryInDays: result.courseDetails.expiryInDays,
            chapters: result.courseDetails.chapters,
          });
          setSelectedLesson(result.courseDetails.chapters[0]?.resource[0]);
          setChapterId(result.courseDetails.chapters[0]?.chapterId);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
  }, [router.query.courseId]);

  return (
    <Layout2>
      {!loading ? (
        <section className={styles.learn_course_page}>
          <div className={styles.learn_breadcrumb}>Courses {SvgIcons.chevronRight} Into to git</div>
          <Flex align="start" justify="space-between">
            <div>
              <div className={styles.video_container}>
                {selectedLesson?.videos[0].videoUrl && !loadingLesson ? (
                  <iframe
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",

                      outline: "none",
                      border: "none",
                    }}
                    src={selectedLesson.videos[0].videoUrl}
                  ></iframe>
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",

                      outline: "none",
                      border: "none",
                    }}
                  >
                    <img src="https://placehold.co/800x450" alt="" />
                  </div>
                )}
              </div>

              <Tabs tabBarGutter={40} className={styles.add_course_tabs} items={items} />
            </div>
            <div className={styles.lessons_container}>
              {lessonItems.map((item, i) => {
                return (
                  <div key={i} className={styles.lessons_list_wrapper}>
                    <Collapse
                      defaultActiveKey={"1"}
                      size="small"
                      accordion={false}
                      activeKey={chapterId}
                      items={[
                        {
                          key: item.key,
                          label: item.label,
                          children: item.children,
                          showArrow: false,
                        },
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          </Flex>
        </section>
      ) : (
        <Spin fullscreen tip="Lessons loading..." />
      )}
    </Layout2>
  );
};

export default LearnCourse;
