import { Card, Flex, Anchor, Group, Badge, Box, Text } from "@mantine/core";
import {
  TypographyStylesProvider,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import "../../styles/StoryItem.module.css";
import classes from "../../styles/StoryItem.module.css";
import { Story, HighlightResult } from "../../types/stories";
import { CONTENT_OPTIONS } from "../../constants/options";
import { format } from "timeago.js";

interface StoryItemProps {
  item: Story;
  onRemoveItem: (item: Story) => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ item, onRemoveItem }) => {
  const theme = useMantineTheme();

  const { colorScheme } = useMantineColorScheme();

  const handleRemoveItem = () => onRemoveItem(item);

  const getFormattedDate = (dateInput: string): string => {
    return format(new Date(dateInput));
  };

  const {
    title,
    url,
    author,
    story_text,
    job_text,
    _tags,
    _highlightResult,
    created_at,
  } = item;

  const getCategory = (): string => _tags[0];

  const getTag = (): string => {
    const filteredTags = CONTENT_OPTIONS.filter((option) =>
      _tags.includes(option.value)
    );
    return filteredTags[filteredTags.length - 1].value.replace(/_/g, " ");
  };

  const getContent = (): string | null => {
    switch (getCategory()) {
      case "story":
        return getHighlightedValue("story_text") || story_text;
      case "job":
        return getHighlightedValue("job_text") || job_text;
      default:
        return null;
    }
  };

  const getHighlightedValue = (
    field: keyof HighlightResult<Story>
  ): string | null => {
    const highlightedWords = _highlightResult?.[field]?.matchedWords || [];
    return highlightedWords.length > 0
      ? _highlightResult?.[field]?.value || null
      : null;
  };

  const getPointsOrComments = (
    property: "points" | "num_comments"
  ): React.ReactNode => {
    const category = getCategory();
    const value =
      category === "story" || category === "poll" ? item[property] : null;

    if (value !== null) {
      const label = property === "points" ? "point" : "comment";
      return (
        <>
          <Text size="sm">
            {value} {value === 1 ? label : `${label}s`}
          </Text>
          <Text size="xs">|</Text>
        </>
      );
    }

    return null;
  };

  const renderTitle = () => {
    const titleProps = {
      fw: 500,
      lh: "xs",
      c: theme.primaryColor,
    };

    return (
      <TypographyStylesProvider
        p={0}
        m={0}
        classNames={{ root: classes.wrapper }}
      >
        <Text
          {...titleProps}
          dangerouslySetInnerHTML={{
            __html: `${getHighlightedValue("title") || title}`,
          }}
        />
      </TypographyStylesProvider>
    );
  };

  const renderUrl = () => {
    const UrlProps = {
      size: "sm",
      c:
        colorScheme === "dark"
          ? "var(--mantine-color-gray-5)"
          : "var(--mantine-color-gray-7)",
      lineClamp: 1,
      w: "fit-content"
    };

    if (url) {
      return (
        <TypographyStylesProvider
          p={0}
          m={0}
          classNames={{ root: classes.wrapper }}
        >
          <Anchor
            href={url}
            target="_blank"
            {...UrlProps}
            dangerouslySetInnerHTML={{
              __html: `${getHighlightedValue("url") || url}`,
            }}
          />
        </TypographyStylesProvider>
      );
    }
  };

  const renderAuthor = () => {
    return (
      <TypographyStylesProvider
        p={0}
        m={0}
        classNames={{ root: classes.wrapper }}
      >
        <Text
          dangerouslySetInnerHTML={{
            __html: `${getHighlightedValue("author") || author}`,
          }}
          size="sm"
        />
      </TypographyStylesProvider>
    );
  };

  const renderContent = () => {
    const contentProps = {
      lineClamp: 2,
      size: "sm",
      mb: 0,
      c: "dimmed",
    };
    if (getContent()) {
      return (
        <TypographyStylesProvider
          p={0}
          m={0}
          classNames={{ root: classes.wrapper }}
        >
          <Text
            {...contentProps}
            dangerouslySetInnerHTML={{ __html: `${getContent()}` }}
          />
        </TypographyStylesProvider>
      );
    }
  };

  return (
    <Card withBorder radius="md">
      <Flex direction="column" gap={1}>
        <Flex justify="space-between" wrap="nowrap" align="start" gap="xs">
          {renderTitle()}
          <Box visibleFrom="xs">
            <Group>
              <Badge
                tt="uppercase"
                fw={700}
                size="sm"
                variant="light"
                radius={2}
              >
                {getTag()}
              </Badge>
            </Group>
          </Box>
        </Flex>
        {renderUrl()}
        {renderContent()}
        <Flex wrap="wrap" rowGap={3} columnGap="xs" align="center" mt={1}>
          {renderAuthor()}
          <Text size="xs">|</Text>
          <Text size="sm">{getFormattedDate(created_at)}</Text>
          <Text size="xs">|</Text>
          {getPointsOrComments("points")}
          {getPointsOrComments("num_comments")}
          <Anchor size="sm" c={theme.primaryColor} onClick={handleRemoveItem}>
            Hide
          </Anchor>
        </Flex>
      </Flex>
    </Card>
  );
};

export default StoryItem;