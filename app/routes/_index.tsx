import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {title: "Music Player"},
    {name: "description", content: "A beautiful music player UI"},
  ];
};

export default function Index() {
  return (
    /* TODO: Landing page */
    <div>landing page</div>
  );
}
