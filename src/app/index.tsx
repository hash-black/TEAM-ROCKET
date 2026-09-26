import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

const categories = {
  Foods: [
    {
      question: "Name a food that is usually eaten with your hands",
      answers: [
        { answer: "tempora", points: 30 },
        { answer: "pisbol", points: 25 },
        { answer: "pila tanan ke?", points: 20 },
        { answer: "pizout", points: 15 },
        { answer: "bitsh", points: 10 },
      ],
    },
    {
      question: "Name something sweet",
      answers: [
        { answer: "cake", points: 30 },
        { answer: "candy", points: 25 },
        { answer: "ice cream", points: 20 },
        { answer: "chocolate", points: 15 },
        { answer: "donut", points: 10 },
      ],
    },
  ],

  Animals: [
    {
      question: "Name an animal people keep as a pet",
      answers: [
        { answer: "dog", points: 30 },
        { answer: "cat", points: 25 },
        { answer: "bird", points: 20 },
        { answer: "fish", points: 15 },
        { answer: "hamster", points: 10 },
      ],
    },
    {
      question: "Name an animal that lives in the water",
      answers: [
        { answer: "fish", points: 30 },
        { answer: "shark", points: 25 },
        { answer: "whale", points: 20 },
        { answer: "dolphin", points: 15 },
        { answer: "octopus", points: 10 },
      ],
    },
  ],
};

type CategoryName = keyof typeof categories;

type SubmittedAnswer = {
  text: string;
  correct: boolean;
  points: number;
};

export default function Index() {
  const [screen, setScreen] = useState<"categories" | "game" | "results">(
    "categories",
  );

  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(
    null,
  );

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerInput, setAnswerInput] = useState("");
  const [score, setScore] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswer[]>(
    [],
  );

  // TIMER
  useEffect(() => {
    if (screen !== "game") return;

    if (timeLeft <= 0) {
      setScreen("results");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  // START GAME
  const startGame = (category: CategoryName) => {
    const questions = categories[category];

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    setSelectedCategory(category);
    setCurrentQuestion(randomQuestion);
    setTimeLeft(60);
    setScore(0);
    setAnswerInput("");
    setSubmittedAnswers([]);
    setScreen("game");
  };

  // SUBMIT ANSWER
  const submitAnswer = () => {
    const cleanedAnswer = answerInput.trim().toLowerCase();

    if (!cleanedAnswer) return;

    const alreadySubmitted = submittedAnswers.some(
      (item) => item.text.toLowerCase() === cleanedAnswer,
    );

    if (alreadySubmitted) {
      setAnswerInput("");
      return;
    }

    const foundAnswer = currentQuestion.answers.find(
      (item: { answer: string; points: number }) =>
        item.answer.toLowerCase() === cleanedAnswer,
    );

    if (foundAnswer) {
      setScore((previous) => previous + foundAnswer.points);

      setSubmittedAnswers((previous) => [
        ...previous,
        {
          text: answerInput.trim(),
          correct: true,
          points: foundAnswer.points,
        },
      ]);
    } else {
      setSubmittedAnswers((previous) => [
        ...previous,
        {
          text: answerInput.trim(),
          correct: false,
          points: 0,
        },
      ]);
    }

    setAnswerInput("");
  };

  // PLAY AGAIN
  const playAgain = () => {
    if (selectedCategory) {
      startGame(selectedCategory);
    }
  };

  // CATEGORY SCREEN
  if (screen === "categories") {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>SOLO</Text>
        <Text style={styles.logoBottom}>FEUD</Text>

        <Text style={styles.tagline}>— TEST YOUR SPEED —</Text>

        <Text style={styles.sectionTitle}>Choose a category</Text>

        {(Object.keys(categories) as CategoryName[]).map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryCard,
              category === "Foods" ? styles.foodCard : styles.animalCard,
            ]}
            onPress={() => startGame(category)}
          >
            <Text style={styles.categoryEmoji}>
              {category === "Foods" ? "🍔" : "🐶"}
            </Text>

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category}</Text>

              <Text style={styles.categoryDescription}>
                {category === "Foods"
                  ? "Answer food-related questions"
                  : "Name animals before the timer runs out"}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  // GAME SCREEN
  if (screen === "game") {
    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.back}>‹</Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.badgeText}>
              {selectedCategory === "Foods" ? "🍔" : "🐶"}{" "}
              {selectedCategory?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreSmall}>SCORE</Text>
            <Text style={styles.scoreNumber}>{score}</Text>
          </View>
        </View>

        <View style={styles.timerCircle}>
          <Text style={styles.timer}>{timeLeft}</Text>
          <Text style={styles.seconds}>SECONDS</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>{currentQuestion?.question}</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type an answer..."
            placeholderTextColor="#7186b8"
            value={answerInput}
            onChangeText={setAnswerInput}
            onSubmitEditing={submitAnswer}
            returnKeyType="done"
            autoCapitalize="none"
          />

          <Pressable style={styles.submit} onPress={submitAnswer}>
            <Text style={styles.submitText}>SUBMIT</Text>
          </Pressable>
        </View>

        <Text style={styles.answersTitle}>— ANSWERS —</Text>

        <ScrollView>
          {submittedAnswers.map((item, index) => (
            <View
              key={index}
              style={[
                styles.answer,
                item.correct ? styles.correct : styles.wrong,
              ]}
            >
              <Text style={styles.answerText}>
                {item.correct ? "✓" : "×"} {item.text}
              </Text>

              {item.correct && (
                <Text style={styles.answerPoints}>+{item.points}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // RESULTS
  const correctCount = submittedAnswers.filter((item) => item.correct).length;

  const wrongCount = submittedAnswers.filter((item) => !item.correct).length;

  const missedAnswers = currentQuestion.answers.filter(
    (answer: { answer: string; points: number }) =>
      !submittedAnswers.some(
        (submitted) =>
          submitted.correct &&
          submitted.text.toLowerCase() === answer.answer.toLowerCase(),
      ),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.timeUp}>⏱ TIME'S UP!</Text>

      <View style={styles.finalScoreBox}>
        <Text style={styles.finalScore}>{score}</Text>
        <Text style={styles.finalLabel}>FINAL SCORE</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, styles.correctBox]}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statNumber}>{correctCount}</Text>
          <Text style={styles.statLabel}>CORRECT</Text>
        </View>

        <View style={[styles.statBox, styles.wrongBox]}>
          <Text style={styles.statIcon}>×</Text>
          <Text style={styles.statNumber}>{wrongCount}</Text>
          <Text style={styles.statLabel}>WRONG</Text>
        </View>
      </View>

      <Text style={styles.missedTitle}>— ANSWERS YOU MISSED —</Text>

      <ScrollView>
        {missedAnswers.map(
          (item: { answer: string; points: number }, index: number) => (
            <View key={index} style={styles.missedAnswer}>
              <Text style={styles.missedText}>× {item.answer}</Text>

              <Text style={styles.missedPoints}>+{item.points}</Text>
            </View>
          ),
        )}
      </ScrollView>

      <Pressable style={styles.bigButton} onPress={playAgain}>
        <Text style={styles.bigButtonText}>↻ PLAY AGAIN</Text>
      </Pressable>

      <Pressable
        style={styles.outlineButton}
        onPress={() => setScreen("categories")}
      >
        <Text style={styles.outlineText}>▦ CHOOSE CATEGORY</Text>
      </Pressable>
    </View>
  );
}
