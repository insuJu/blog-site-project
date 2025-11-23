#Build
FROM gradle:8.5-jdk21-alpine AS builder
WORKDIR /app
COPY backend/build.gradle backend/settings.gradle backend/gradlew ./
COPY backend/gradle ./gradle
RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon || true
COPY backend/src ./src
RUN ./gradlew clean build -x test --no-daemon

#Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder /app/build/libs/blog-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=prod -jar app.jar"]
